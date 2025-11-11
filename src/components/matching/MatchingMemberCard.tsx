// 매칭 서비스 전용 회원 카드 컴포넌트
import { useNavigate } from "react-router-dom";
import techColorMap from "../../utils/tech-corlor-map";
import {
  MatchingMember,
  MatchingMemberByInterest,
  MatchingMemberByTechStack,
  MatchingNewMember,
} from "../../types/api/matching";

interface MatchingMemberCardProps {
  member:
    | MatchingMember
    | MatchingMemberByInterest
    | MatchingMemberByTechStack
    | MatchingNewMember;
  showMatchInfo?: boolean; // 매칭 정보 표시 여부
}

export default function MatchingMemberCard({
  member,
  showMatchInfo = true,
}: MatchingMemberCardProps) {
  const navigate = useNavigate();

  // 매칭 정보 렌더링 함수
  const renderMatchInfo = () => {
    if (!showMatchInfo) return null;

    // 관심사 기반 매칭
    if ("matchCount" in member && "commonInterests" in member) {
      return (
        <div className="mb-2">
          <p className="text-xs sm:text-sm font-semibold text-[#002F6C]">
            💙 {member.matchCount}개의 관심사가 같아요!
          </p>
          <div className="flex flex-wrap gap-1 mt-1">
            {member.commonInterests.slice(0, 2).map((interest, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[10px] sm:text-xs bg-blue-100 text-[#002F6C] rounded-full"
              >
                {interest}
              </span>
            ))}
            {member.commonInterests.length > 2 && (
              <span className="text-[10px] sm:text-xs text-gray-500">
                +{member.commonInterests.length - 2}
              </span>
            )}
          </div>
        </div>
      );
    }

    // 기술 스택 기반 매칭
    if ("stackMatchCount" in member && "commonStacks" in member) {
      return (
        <div className="mb-2">
          <p className="text-xs sm:text-sm font-semibold text-[#002F6C]">
            💻 {member.stackMatchCount}개의 기술 스택이 같아요!
          </p>
          <div className="flex flex-wrap gap-1 mt-1">
            {member.commonStacks.slice(0, 2).map((stack, i) => {
              const colorClass = techColorMap[stack] || "bg-gray-300 text-gray-800";
              return (
                <span
                  key={i}
                  className={`px-2 py-0.5 text-[10px] sm:text-xs rounded ${colorClass}`}
                >
                  {stack}
                </span>
              );
            })}
            {member.commonStacks.length > 2 && (
              <span className="text-[10px] sm:text-xs text-gray-500">
                +{member.commonStacks.length - 2}
              </span>
            )}
          </div>
        </div>
      );
    }

    // 신규 가입 회원
    if ("joinedDate" in member) {
      const joinedDate = new Date(member.joinedDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - joinedDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return (
        <div className="mb-2">
          <span className="inline-block px-2 py-1 text-[10px] sm:text-xs font-semibold text-white bg-green-500 rounded">
            ✨ {diffDays}일 전 가입
          </span>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className="p-3 sm:p-4 transition-shadow duration-200 bg-white border rounded-lg shadow-sm cursor-pointer hover:shadow-md"
      onClick={() => navigate(`/profile/${member.memberId}`)}
    >
      {/* 프로필 이미지 */}
      <div className="flex items-start gap-3 sm:gap-4">
        <img
          src={member.memberImageUrl || "/assets/images/user.png"}
          alt={member.memberName}
          className="object-cover w-12 h-12 sm:w-16 sm:h-16 border rounded-full flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          {/* 이름 & 학과 */}
          <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
            {member.memberName}
          </h3>
          {member.memberDepartmentResponseDtoList &&
            member.memberDepartmentResponseDtoList.length > 0 && (
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {member.memberDepartmentResponseDtoList[0].departmentName}
              </p>
            )}

          {/* 팔로워 수 */}
          {member.followerCount !== undefined && (
            <p className="text-xs text-gray-500">
              팔로워 {member.followerCount}명
            </p>
          )}
        </div>
      </div>

      {/* 한 줄 소개 */}
      {member.memberIntroduce && (
        <p className="mt-2 text-xs sm:text-sm text-gray-700 line-clamp-2">
          {member.memberIntroduce}
        </p>
      )}

      {/* 매칭 정보 (공통 관심사, 기술 스택, 가입일 등) */}
      <div className="mt-2 sm:mt-3">{renderMatchInfo()}</div>

      {/* 관심분야 태그 */}
      {member.memberInterestResponseDtoList &&
        member.memberInterestResponseDtoList.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {member.memberInterestResponseDtoList.slice(0, 2).map((interest) => (
              <span
                key={interest.interestId}
                className="px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs bg-blue-50 text-[#002F6C] border border-blue-200 rounded-full"
              >
                {interest.interestName}
              </span>
            ))}
            {member.memberInterestResponseDtoList.length > 2 && (
              <span className="text-[10px] sm:text-xs text-gray-500">
                +{member.memberInterestResponseDtoList.length - 2}
              </span>
            )}
          </div>
        )}

      {/* 기술 스택 */}
      {member.memberTechStackResponseDtoList &&
        member.memberTechStackResponseDtoList.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {member.memberTechStackResponseDtoList.slice(0, 2).map((stack) => {
              const colorClass =
                techColorMap[stack.techStackName] || "bg-gray-300 text-gray-800";
              return (
                <span
                  key={stack.techStackId}
                  className={`px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs rounded ${colorClass}`}
                >
                  {stack.techStackName}
                </span>
              );
            })}
            {member.memberTechStackResponseDtoList.length > 2 && (
              <span className="text-[10px] sm:text-xs text-gray-500">
                +{member.memberTechStackResponseDtoList.length - 2}
              </span>
            )}
          </div>
        )}
    </div>
  );
}
