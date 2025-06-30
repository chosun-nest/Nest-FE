// 프로필 카드 컴포넌트
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GithubLogo, LinkedinLogo, InstagramLogo } from "phosphor-react"; // npm install phosphor-react
import { ModalContent } from "../../../types/modal";
import { ProfileCardProps } from "../../../types/profile";  // 프로필 관련 api용 ts
//import { MemberProfile } from "../../../types/api/profile"; // 프로필 컴포넌트 관련 ts
import Modal from "../../common/modal";
import techColorMap from "../../../utils/tech-corlor-map";
import ProfileActionButton from "./FollowOrEditButton";
import FollowListModal from "../follow/FollowListModal";    //팔로워/팔로잉 수 하위
import {
  checkMyFollowers,
  checkMyFollowings,
  checkOthersFollowers,
  checkOthersFollowings,
} from "../../../api/following/follow";
import FollowStats from "../follow/FollowStats";

export default function ProfileCard({ profile, isOwnProfile }: ProfileCardProps) {
  const navigate = useNavigate();
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });
  const [showModal, setShowModal] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [modalType, setModalType] = useState<"follower" | "following" | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      const [followers, followings] = isOwnProfile
        ? await Promise.all([
            checkMyFollowers(),
            checkMyFollowings(),
          ])
        : await Promise.all([
            checkOthersFollowers(String(profile.memberId)),
            checkOthersFollowings(String(profile.memberId)),
          ]);

      setFollowerCount(followers.totalCount);
      setFollowingCount(followings.totalCount);
    };

    fetchCounts();
  }, [profile.memberId, isOwnProfile]);

  useEffect(() => {
    const fetchCounts = async () => {
      const [followers, followings] = await Promise.all([
        checkOthersFollowers(String(profile.memberId)),
        checkOthersFollowings(String(profile.memberId)),
      ]);
      setFollowerCount(followers.totalCount);
      setFollowingCount(followings.totalCount);
    };
    fetchCounts();
  }, [profile.memberId]);

  const handleMissingLink = () => {
    setModalContent({
      title: "알림",
      message: "아직 등록되지 않은 링크입니다.\n수정 버튼을 눌러 프로필을 수정하세요.",
      type: "info",
    });
    setShowModal(true);
  };

  if (!profile) {
    return (
      <div className="w-80 h-[450px] p-4 border rounded-xl shadow-md bg-white flex items-center justify-center">
        <p className="text-sm text-gray-500">⚠️ 프로필 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="p-4 bg-white border shadow-md w-80 rounded-xl">
        {/* 프로필 이미지 */}
        <div className="flex justify-center mb-7">
          <img
            src={profile.image || "/assets/images/user.png"}
            alt="Profile"
            className={`w-20 h-20 border rounded-full sm:h-24 sm:w-24 md:h-28 md:w-28
              cursor-pointer hover:opacity-80`}
            onClick={() => {
              if (isOwnProfile) {
                navigate("/profile");
              } else {
                navigate(`/profile/${profile.memberId}`);
              }
            }}
          />
        </div>

      {/* 이름, 전공, 인증 */}
      <div className="flex items-center gap-2 mt-2">
        <h2
          className="text-lg font-bold cursor-pointer hover:underline"
          onClick={isOwnProfile ? () => navigate("/profile") : undefined}
        >
          {profile.name}
        </h2>
        <div className="flex items-center gap-1">
          <p className="text-gray-500">{profile.major}</p>

          {/* 내 계정이든 타인이든 chosun 이메일이면 인증 뱃지 */}
          {(profile.email?.endsWith("@chosun.ac.kr") || profile.email?.endsWith("@chosun.kr")) && (
            <img
              src="/assets/images/verified-badge.png"
              alt="인증"
              title="조선대 인증 이메일"
              className="w-4 h-4"
            />
          )}
        </div>
      </div>

        {/* 한 줄 소개 */}
        <p className="mt-2 text-sm text-left">{profile.introduce}</p>
        
        {/* 팔로우 수 표시 */}
        <FollowStats
          memberId={profile.memberId}
          memberName={profile.name}
          followerCount={followerCount}
          followingCount={followingCount}
          isMyself={isOwnProfile}
          onRefreshFollowerCount={() =>
            checkOthersFollowers(String(profile.memberId)).then((res) =>
              setFollowerCount(res.totalCount)
            )
          }
          onRefreshFollowingCount={() =>
            checkOthersFollowings(String(profile.memberId)).then((res) =>
              setFollowingCount(res.totalCount)
            )
          }
        />

        {/* 팔로워 리스트 모달 */}
        {modalType && (
          <FollowListModal
            type={modalType as "follower" | "following"}
            memberId={profile.memberId}
            memberName={profile.name}
            isMyself={isOwnProfile}
            onClose={() => setModalType(null)}
            onRefreshFollowerCount={() => {
              checkOthersFollowers(String(profile.memberId)).then(res => setFollowerCount(res.totalCount));
            }}
            onRefreshFollowingCount={() => {
              checkOthersFollowings(String(profile.memberId)).then(res => setFollowingCount(res.totalCount));
            }}
          />
        )}
        
        {/* 기술 스택 */}
        <div className="flex flex-wrap gap-2 mt-5">
          {profile.techStacks?.map((stack: string, i: number) => {
            const colorClass = techColorMap[stack] || "bg-gray-300 text-gray-800";
            return (
              <span
                key={i}
                className={`px-4 py-2 rounded-xs text-xs font-mono ${colorClass}`}
              >
                {stack}
              </span>
            );
          })}
        </div>

        {/* SNS 아이콘 */}
        <div className="flex items-center justify-center gap-3 mt-10">
          {[GithubLogo, LinkedinLogo, InstagramLogo].map((Icon, index) =>
            profile.sns?.[index] ? (
              <a key={index} href={profile.sns[index]} target="_blank" rel="noreferrer">
                <Icon
                  size={48}
                  color="#002f6c"
                  className="w-12 h-12 cursor-pointer hover:opacity-80"
                />
              </a>
            ) : (
              <Icon
                key={index}
                size={48}
                color="#002f6c"
                className="w-12 h-12 cursor-pointer hover:opacity-80"
                onClick={handleMissingLink}
              />
            )
          )}
        </div>

        {/* 버튼 영역: 팔로우/수정 버튼 통합 */}
        <ProfileActionButton isMine={isOwnProfile} memberId={profile.memberId} />
        {/* 추후 targetUserId는 외부에서 받아오도록 구조 개선 */}
      </div>


      {showModal && (
        <Modal
          title={modalContent.title}
          message={modalContent.message}
          type={modalContent.type}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}