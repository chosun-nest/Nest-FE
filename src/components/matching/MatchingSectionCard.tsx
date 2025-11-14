// 매칭 섹션 카드 컴포넌트 (그리드 레이아웃용)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserId } from "../../store/slices/authSlice";
import { follow, unfollow, checkMyFollowings } from "../../api/following/follow";
import {
  MatchingMember,
  MatchingMemberByInterest,
  MatchingMemberByTechStack,
  MatchingNewMember,
} from "../../types/api/matching";

interface MatchingSectionCardProps {
  title: string;
  icon: string;
  members:
    | MatchingMember[]
    | MatchingMemberByInterest[]
    | MatchingMemberByTechStack[]
    | MatchingNewMember[];
  isLoading?: boolean;
  error?: string | null;
  variant?: "large" | "medium" | "tall"; // 카드 크기 타입
  maxDisplay?: number; // 최대 표시 회원 수
}

interface MatchingSectionCardPropsExtended extends MatchingSectionCardProps {
  sectionType?: "interest" | "techStack" | "sameMajor" | "popular" | "newMembers";
}

export default function MatchingSectionCard({
  title,
  icon,
  members,
  isLoading = false,
  error = null,
  variant: _variant = "medium",
  maxDisplay = 4,
  sectionType,
}: MatchingSectionCardPropsExtended) {
  const navigate = useNavigate();
  const currentMemberId = useSelector(selectUserId);
  const displayMembers = members.slice(0, maxDisplay);
  const [followingIds, setFollowingIds] = useState<Set<number>>(new Set());
  const [loadingFollowIds, setLoadingFollowIds] = useState<Set<number>>(new Set());
  const [isCheckingFollows, setIsCheckingFollows] = useState(true);

  // 팔로우 상태 확인
  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const response = await checkMyFollowings();
        const followingSet = new Set(
          response.users?.map((user) => user.memberId) || []
        );
        setFollowingIds(followingSet);
      } catch (error) {
        console.error("팔로우 상태 확인 실패:", error);
      } finally {
        setIsCheckingFollows(false);
      }
    };

    checkFollowStatus();
  }, []);

  // 팔로우/언팔로우 핸들러
  const handleFollowToggle = async (
    e: React.MouseEvent,
    memberId: number
  ) => {
    e.stopPropagation();

    // 본인인 경우 무시
    if (currentMemberId && Number(currentMemberId) === memberId) return;

    // 이미 로딩 중이면 무시
    if (loadingFollowIds.has(memberId)) return;

    const isFollowing = followingIds.has(memberId);

    try {
      // 로딩 상태 추가
      setLoadingFollowIds((prev) => new Set(prev).add(memberId));

      if (isFollowing) {
        // 언팔로우
        await unfollow(String(memberId));
        setFollowingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(memberId);
          return newSet;
        });
      } else {
        // 팔로우
        await follow(String(memberId));
        setFollowingIds((prev) => new Set(prev).add(memberId));
      }
    } catch (error) {
      console.error("팔로우 처리 실패:", error);
      alert("팔로우 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      // 로딩 상태 제거
      setLoadingFollowIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(memberId);
        return newSet;
      });
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="h-full p-6 bg-white border rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-[#002F6C] mb-4 flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          {title}
        </h3>
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-[#002F6C] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-sm text-gray-600">불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="h-full p-6 bg-white border rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-[#002F6C] mb-4 flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          {title}
        </h3>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">⚠️ {error}</p>
        </div>
      </div>
    );
  }

  // 데이터 없음
  if (members.length === 0) {
    return (
      <div className="h-full p-6 bg-white border rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-[#002F6C] mb-4 flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          {title}
        </h3>
        <div className="p-6 text-center bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">추천할 사용자가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-5 lg:p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 flex-shrink-0">
        <h3 className="text-base lg:text-lg font-bold text-[#002F6C] flex items-center gap-2">
          <span className="text-xl lg:text-2xl">{icon}</span>
          <span className="line-clamp-1">{title}</span>
        </h3>
        {members.length > maxDisplay && (
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            +{members.length - maxDisplay}
          </span>
        )}
      </div>

      {/* 회원 리스트 - 스크롤 가능 영역 */}
      <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
        {displayMembers.map((member) => {
          const isOwnProfile = currentMemberId ? Number(currentMemberId) === member.memberId : false;
          const isFollowing = followingIds.has(member.memberId);
          const isFollowLoading = loadingFollowIds.has(member.memberId);

          // 타입 가드를 사용한 매칭 정보 추출
          const matchCount = "matchCount" in member ? (member.matchCount as number) : undefined;
          const stackMatchCount = "stackMatchCount" in member ? (member.stackMatchCount as number) : undefined;

          return (
            <div
              key={member.memberId}
              className="group flex items-center gap-3 p-2.5 lg:p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border hover:border-blue-200 transition-all duration-150"
            >
              <div
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                onClick={() => navigate(`/profile/${member.memberId}`)}
              >
                {/* 프로필 이미지 */}
                <img
                  src={member.memberImageUrl || "/assets/images/user.png"}
                  alt={member.memberName}
                  className="object-cover w-10 h-10 lg:w-11 lg:h-11 border-2 border-white rounded-full flex-shrink-0 shadow-sm group-hover:border-blue-200 transition-colors"
                />

                {/* 회원 정보 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#002F6C] transition-colors">
                    {member.memberName}
                  </p>
                  {member.memberDepartmentResponseDtoList &&
                    member.memberDepartmentResponseDtoList.length > 0 && (
                      <p className="text-xs text-gray-600 truncate">
                        {member.memberDepartmentResponseDtoList[0].departmentName}
                      </p>
                    )}

                  {/* 매칭 정보 */}
                  <div className="flex items-center gap-2 mt-0.5">
                    {matchCount !== undefined && matchCount > 0 && (
                      <span className="text-xs text-[#002F6C] font-medium">
                        💙 {matchCount}
                      </span>
                    )}
                    {stackMatchCount !== undefined && stackMatchCount > 0 && (
                      <span className="text-xs text-[#002F6C] font-medium">
                        💻 {stackMatchCount}
                      </span>
                    )}
                    {member.followerCount !== undefined && member.followerCount > 0 && (
                      <span className="text-xs text-gray-500">
                        팔로워 {member.followerCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 팔로우 버튼 */}
              {!isOwnProfile && (
                <button
                  onClick={(e) => handleFollowToggle(e, member.memberId)}
                  disabled={isFollowLoading || isCheckingFollows}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
                    isFollowing
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-[#002F6C] text-white hover:bg-[#001f4d]"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isCheckingFollows
                    ? "..."
                    : isFollowLoading
                    ? "처리중"
                    : isFollowing
                    ? "팔로잉"
                    : "팔로우"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 더보기 버튼 */}
      {sectionType && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/matching/${sectionType}`);
          }}
          className="w-full mt-4 py-2.5 text-sm font-medium text-[#002F6C] bg-blue-50 border border-blue-200 rounded-lg hover:bg-[#002F6C] hover:text-white transition-all duration-200 flex-shrink-0"
        >
          {members.length > maxDisplay ? `전체보기 (${members.length}명)` : "더보기"}
        </button>
      )}
    </div>
  );
}
