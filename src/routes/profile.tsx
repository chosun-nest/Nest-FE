// 사용자 본인 프로필 페이지
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/slices/authSlice";
import Modal from "../components/common/modal";
import { ModalContent } from "../types/modal";
import {
  GridContainer,
  GridItem,
  ItemTitle,
} from "../assets/styles/profile.styles"; // 프로필 grid 적용
import { getMemberProfile } from "../api/profile/ProfileAPI";
import { ProfileType } from "../types/profile";
import SkeletonProfileCard from "../components/profile/card/SkeletonProfileCard";
import ProfileCard from "../components/profile/card/ProfileCard";   // 프로필 카드 컴포넌트
import { CaretDown, CaretUp } from "phosphor-react"; // history 열림, 닫힘용
import useResponsive from "../hooks/responsive";
import { useNavbarHeight } from "../context/NavbarHeightContext";
import HistoryTimeline from "../components/profile/history/historytimeline";
import MyPin from "../components/profile/history/mypins";

export default function Profile() {
  const { navbarHeight } = useNavbarHeight();
  const isMobile = useResponsive();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });

  const [profile, setProfile] = useState<ProfileType | null>(null);
  // history 열림/닫힘 상태
  const [historyOpen, setHistoryOpen] = useState(true);

  // 로그인 여부 확인
  useEffect(() => {
    if (!isLoggedIn) {
      setModalContent({
        title: "로그인 필요",
        message: "로그인이 필요한 페이지 입니다",
        type: "error",
        onClose: () => navigate("/login"),
      });
      setShowModal(true);
    } else {
      // 프로필 데이터 불러오기
      const fetchProfile = async () => {
        try {
          const data = await getMemberProfile();
          const profileData: ProfileType = {
            memberId: data.memberId,
            image: data.memberImageUrl,
            name: data.memberName,
            email: data.memberEmail,
            major: data.memberDepartmentResponseDtoList[0]?.departmentName || "",
            introduce: data.memberIntroduce || "",
            techStacks: data.memberTechStackResponseDtoList.map(
              (t: { techStackId: number; techStackName: string }) => t.techStackName
            ),
            sns: [
              data.memberSnsUrl1,
              data.memberSnsUrl2,
              data.memberSnsUrl3,
              data.memberSnsUrl4,
            ].filter(Boolean),
          };
          setProfile(profileData);
        } catch (err) {
          console.error("프로필 정보를 불러오지 못했습니다", err);
          setModalContent({
            title: "조회 실패",
            message: "프로필 정보를 불러오지 못했습니다",
            type: "error",
          });
          setShowModal(true);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      {showModal && (
        <Modal
          title={modalContent.title}
          message={modalContent.message}
          type={modalContent.type}
          onClose={() => {
            setShowModal(false);
            modalContent.onClose?.();
          }}
        />
      )}

      <GridContainer $isMobile={isMobile} $navbarHeight={navbarHeight}>
        {/* 1행: 내 프로필 */}
        <GridItem $isMobile={isMobile} $row="1" $col="1">
          {loading || !profile ? (
            <SkeletonProfileCard />   // 프로필 카드 UX 최적화, 깜빡임 제거
          )  : (
            <ProfileCard 
              profile={profile} 
              isOwnProfile={true}
              //targetUserId={profile.memberId}
             />
          )}
        </GridItem>
        
        {/* 1행: History (min-height 해제) */}
        <GridItem
          $isMobile={isMobile}
          $row="1"
          $col="2"
          $colSpan="2"
          $noMinHeight={true}
        >
          {/* 헤더에 onClick 걸기 */}
          <ItemTitle onClick={() => setHistoryOpen((o) => !o)}>
            <span>My Pins</span>
            {historyOpen ? (
              <CaretUp size={20} weight="bold" />
            ) : (
              <CaretDown size={20} weight="bold" />
            )}
          </ItemTitle>

          {historyOpen && (
            <div style={{ padding: 16 }}>
              <MyPin title={""} editable />
            </div>
          )}
        </GridItem>

        {/* 2행: 활동 로그 */}
        <GridItem $isMobile={isMobile} $row="2" $col="2" $colSpan="2">
          <ItemTitle>History</ItemTitle>

          <HistoryTimeline />
        </GridItem>
      </GridContainer>
    </>
  );
}
