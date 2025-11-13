// 매칭 서비스 사용자 카드 (개선된 UI)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserId } from "../../store/slices/authSlice";
import { follow, unfollow, checkMyFollowings } from "../../api/following/follow";
import techColorMap from "../../utils/tech-corlor-map";
import {
  MatchingMember,
  MatchingMemberByInterest,
  MatchingMemberByTechStack,
  MatchingNewMember,
} from "../../types/api/matching";

interface MatchingUserCardProps {
  member:
    | MatchingMember
    | MatchingMemberByInterest
    | MatchingMemberByTechStack
    | MatchingNewMember;
  showMatchInfo?: boolean;
}

export default function MatchingUserCard({
  member,
  showMatchInfo = true,
}: MatchingUserCardProps) {
  const navigate = useNavigate();
  const currentMemberId = useSelector(selectUserId);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isCheckingFollow, setIsCheckingFollow] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // 본인 여부 확인
  const isOwnProfile = currentMemberId ? Number(currentMemberId) === member.memberId : false;

  // 팔로우 상태 확인
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (isOwnProfile) {
        setIsCheckingFollow(false);
        return;
      }

      try {
        const response = await checkMyFollowings();
        const isFollowingUser = response.users?.some(
          (user) => user.memberId === member.memberId
        ) || false;
        setIsFollowing(isFollowingUser);
      } catch (error) {
        console.error("팔로우 상태 확인 실패:", error);
        setIsFollowing(false);
      } finally {
        setIsCheckingFollow(false);
      }
    };

    checkFollowStatus();
  }, [member.memberId, isOwnProfile, currentMemberId]);

  // 팔로우/언팔로우 핸들러
  const handleFollowToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOwnProfile || isFollowLoading) return;

    const previousFollowState = isFollowing;

    try {
      setIsFollowLoading(true);

      if (isFollowing) {
        // 언팔로우
        await unfollow(String(member.memberId));
        setIsFollowing(false);
      } else {
        // 팔로우
        await follow(String(member.memberId));
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("팔로우 처리 실패:", error);
      // 에러 발생 시 이전 상태로 복원
      setIsFollowing(previousFollowState);
      alert("팔로우 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsFollowLoading(false);
    }
  };

  // 매칭 정보 렌더링
  const renderMatchBadge = () => {
    if (!showMatchInfo) return null;

    if ("matchCount" in member) {
      const matchCount = member.matchCount as number;
      if (matchCount > 0) {
        return (
          <span className="text-xs font-medium text-[#002F6C] bg-blue-100 px-2 py-1 rounded">
            💙 {matchCount}개 일치
          </span>
        );
      }
    }

    if ("stackMatchCount" in member) {
      const stackMatchCount = member.stackMatchCount as number;
      if (stackMatchCount > 0) {
        return (
          <span className="text-xs font-medium text-[#002F6C] bg-blue-100 px-2 py-1 rounded">
            💻 {stackMatchCount}개 일치
          </span>
        );
      }
    }

    if ("joinedDate" in member) {
      const joinedDate = new Date(member.joinedDate as string);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - joinedDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return (
        <span className="text-xs font-medium text-white bg-green-500 px-2 py-1 rounded">
          ✨ {diffDays}일 전 가입
        </span>
      );
    }

    return null;
  };

  return (
    <div className="group p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-200">
      {/* 상단: 프로필 이미지 + 이름/학과 + 팔로우 버튼 */}
      <div
        className="flex items-center gap-3 mb-3 cursor-pointer"
        onClick={() => navigate(`/profile/${member.memberId}`)}
      >
        <img
          src={member.memberImageUrl || "/assets/images/user.png"}
          alt={member.memberName}
          className="w-12 h-12 rounded-full border-2 border-gray-200 object-cover flex-shrink-0 group-hover:border-blue-300 transition-colors"
        />

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-[#002F6C] transition-colors">
            {member.memberName}
          </h3>
          {member.memberDepartmentResponseDtoList &&
            member.memberDepartmentResponseDtoList.length > 0 && (
              <p className="text-xs text-gray-600 truncate">
                {member.memberDepartmentResponseDtoList[0].departmentName}
              </p>
            )}
        </div>

        {!isOwnProfile && (
          <button
            onClick={handleFollowToggle}
            disabled={isFollowLoading || isCheckingFollow}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex-shrink-0 ${
              isFollowing
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-[#002F6C] text-white hover:bg-[#001f4d]"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isCheckingFollow
              ? "확인중"
              : isFollowLoading
              ? "처리중"
              : isFollowing
              ? "팔로잉"
              : "팔로우"}
          </button>
        )}
      </div>

      {/* 중단: 매칭 뱃지 + 팔로워 수 */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {renderMatchBadge()}
        </div>
        <span className="text-xs text-gray-500">
          팔로워 {member.followerCount || 0}명
        </span>
      </div>

      {/* 펼치기 버튼 */}
      {(member.memberIntroduce ||
        (member.memberInterestResponseDtoList && member.memberInterestResponseDtoList.length > 0) ||
        (member.memberTechStackResponseDtoList && member.memberTechStackResponseDtoList.length > 0)) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="text-xs text-[#002F6C] hover:text-[#001f4d] font-medium mb-3 transition-colors"
        >
          {isExpanded ? "▼ 접기" : "▶ 상세정보 보기"}
        </button>
      )}

      {/* 상세 정보 (펼쳤을 때만 표시) */}
      {isExpanded && (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          {/* 한 줄 소개 */}
          {member.memberIntroduce && (
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {member.memberIntroduce}
            </p>
          )}

          {/* 하단: 관심태그 & 기술스택 */}
          <div className="space-y-2">
            {member.memberInterestResponseDtoList &&
              member.memberInterestResponseDtoList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-xs text-gray-500 font-medium">💙</span>
                  {member.memberInterestResponseDtoList.slice(0, 3).map((interest) => (
                    <span
                      key={interest.interestId}
                      className="px-2 py-0.5 text-xs bg-blue-50 text-[#002F6C] border border-blue-200 rounded"
                    >
                      {interest.interestName}
                    </span>
                  ))}
                  {member.memberInterestResponseDtoList.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{member.memberInterestResponseDtoList.length - 3}
                    </span>
                  )}
                </div>
              )}

            {member.memberTechStackResponseDtoList &&
              member.memberTechStackResponseDtoList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-xs text-gray-500 font-medium">💻</span>
                  {member.memberTechStackResponseDtoList.slice(0, 3).map((stack) => {
                    const colorClass =
                      techColorMap[stack.techStackName] ||
                      "bg-gray-200 text-gray-800";
                    return (
                      <span
                        key={stack.techStackId}
                        className={`px-2 py-0.5 text-xs rounded ${colorClass}`}
                      >
                        {stack.techStackName}
                      </span>
                    );
                  })}
                  {member.memberTechStackResponseDtoList.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{member.memberTechStackResponseDtoList.length - 3}
                    </span>
                  )}
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
