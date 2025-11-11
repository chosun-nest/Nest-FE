// 매칭 섹션 카드 컴포넌트 (그리드 레이아웃용)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function MatchingSectionCard({
  title,
  icon,
  members,
  isLoading = false,
  error = null,
  variant = "medium",
  maxDisplay = 4,
}: MatchingSectionCardProps) {
  const navigate = useNavigate();
  const displayMembers = members.slice(0, maxDisplay);

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
    <div className="h-full flex flex-col p-5 lg:p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
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
        {displayMembers.map((member) => (
          <div
            key={member.memberId}
            onClick={() => navigate(`/profile/${member.memberId}`)}
            className="group flex items-center gap-3 p-2.5 lg:p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50 hover:border hover:border-blue-200 transition-all duration-150"
          >
            {/* 프로필 이미지 */}
            <img
              src={member.memberImageUrl || "/assets/images/user.png"}
              alt={member.memberName}
              className="object-cover w-10 h-10 lg:w-12 lg:h-12 border-2 border-white rounded-full flex-shrink-0 shadow-sm group-hover:border-blue-200 transition-colors"
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

              {/* 관심사 매칭 정보 */}
              {"matchCount" in member && member.matchCount > 0 && (
                <p className="text-xs text-[#002F6C] font-medium mt-0.5">
                  💙 {member.matchCount}개 일치
                </p>
              )}

              {/* 기술 스택 매칭 정보 */}
              {"stackMatchCount" in member && member.stackMatchCount > 0 && (
                <p className="text-xs text-[#002F6C] font-medium mt-0.5">
                  💻 {member.stackMatchCount}개 일치
                </p>
              )}

              {/* 팔로워 수 */}
              {member.followerCount !== undefined && member.followerCount > 0 && (
                <p className="text-xs text-gray-500 mt-0.5">
                  팔로워 {member.followerCount}명
                </p>
              )}
            </div>

            {/* 화살표 아이콘 */}
            <div className="text-gray-400 group-hover:text-[#002F6C] transition-colors text-lg">
              →
            </div>
          </div>
        ))}
      </div>

      {/* 더보기 버튼 */}
      {members.length > maxDisplay && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            // TODO: 전체 목록 모달 또는 페이지로 이동
            console.log("더보기 클릭");
          }}
          className="w-full mt-4 py-2.5 text-sm font-medium text-[#002F6C] bg-blue-50 border border-blue-200 rounded-lg hover:bg-[#002F6C] hover:text-white transition-all duration-200"
        >
          전체보기 ({members.length}명)
        </button>
      )}
    </div>
  );
}
