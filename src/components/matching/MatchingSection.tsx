// 매칭 서비스 섹션 컴포넌트 (각 추천 카테고리)
import { useState } from "react";
import MatchingUserCard from "./MatchingUserCard";
import {
  MatchingMember,
  MatchingMemberByInterest,
  MatchingMemberByTechStack,
  MatchingNewMember,
} from "../../types/api/matching";

interface MatchingSectionProps {
  title: string;
  icon: string;
  members:
    | MatchingMember[]
    | MatchingMemberByInterest[]
    | MatchingMemberByTechStack[]
    | MatchingNewMember[];
  isLoading?: boolean;
  error?: string | null;
  onViewMore?: () => void; // 더보기 클릭 시 호출
  showMatchInfo?: boolean;
}

export default function MatchingSection({
  title,
  icon,
  members,
  isLoading = false,
  error = null,
  onViewMore,
  showMatchInfo = true,
}: MatchingSectionProps) {
  const [expanded, setExpanded] = useState(false);

  // 표시할 회원 수 (처음 4명, 확장 시 전체)
  const displayMembers = expanded ? members : members.slice(0, 4);

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-[#002F6C] flex items-center gap-2">
          {icon} {title}
        </h2>
        <div className="flex items-center justify-center p-12 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-[#002F6C] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-sm text-gray-600">불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-[#002F6C] flex items-center gap-2">
          {icon} {title}
        </h2>
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">⚠️ {error}</p>
        </div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-[#002F6C] flex items-center gap-2">
          {icon} {title}
        </h2>
        <div className="p-8 text-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">추천할 사용자가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 sm:mb-8">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#002F6C] flex items-center gap-2">
          <span className="text-xl sm:text-2xl">{icon}</span>
          <span className="text-base sm:text-xl">{title}</span>
        </h2>
        {members.length > 4 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs sm:text-sm text-[#002F6C] hover:underline font-medium whitespace-nowrap"
          >
            {expanded ? "접기 ▲" : `더보기 ▼`}
          </button>
        )}
      </div>

      {/* 회원 카드 그리드 */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayMembers.map((member) => (
          <MatchingUserCard
            key={member.memberId}
            member={member}
            showMatchInfo={showMatchInfo}
          />
        ))}
      </div>

      {/* 더보기 버튼 (확장된 상태에서 추가 페이지 로드) */}
      {expanded && onViewMore && (
        <div className="mt-4 text-center">
          <button
            onClick={onViewMore}
            className="px-6 py-2 text-[#002F6C] border border-[#002F6C] rounded-md hover:bg-[#002F6C] hover:text-white transition-colors"
          >
            더 많은 사용자 보기
          </button>
        </div>
      )}
    </div>
  );
}
