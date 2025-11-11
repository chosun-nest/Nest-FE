// 매칭 서비스 전용 검색 컴포넌트
import { useState } from "react";
//import { useDebounce } from "../../hooks/useDebounce";
import { searchMatchingMembers } from "../../api/matching/MatchingAPI";
import { MatchingMember, MatchingSearchType } from "../../types/api/matching";
import MatchingUserCard from "./MatchingUserCard";
import TagFilterModal from "../board/tag/TagFilterModal";

export default function MatchingSearch() {
  const [keyword, setKeyword] = useState("");
  const [searchType, setSearchType] = useState<MatchingSearchType>("name");
  const [searchResults, setSearchResults] = useState<MatchingMember[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [showTagModal, setShowTagModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  //const debouncedKeyword = useDebounce(keyword, 300);

  // 검색 실행
  const handleSearch = async () => {
    // 태그 검색인 경우
    if (searchType === "tag") {
      if (selectedTags.length === 0) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }
      // TODO: 백엔드 API에서 태그로 검색하는 엔드포인트 추가 필요
      console.log("태그 검색:", selectedTags);
      setShowResults(true);
      return;
    }

    // 일반 검색
    if (!keyword.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await searchMatchingMembers(keyword.trim(), searchType, 0, 20);
      setSearchResults(response.members);
      setTotalCount(response.totalElements);
      setShowResults(true);
    } catch (error) {
      console.error("검색 실패:", error);
      setSearchResults([]);
      setShowResults(true);
    } finally {
      setIsSearching(false);
    }
  };

  // 태그 제거
  const removeTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <div className="w-full mb-6 sm:mb-8">
      {/* 검색 바 */}
      <div className="flex flex-col gap-3 p-3 sm:p-4 bg-white border rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* 검색 타입 선택 */}
          <select
            value={searchType}
            onChange={(e) => {
              const newType = e.target.value as MatchingSearchType;
              setSearchType(newType);
              if (newType === "tag") {
                setKeyword("");
              }
            }}
            className="px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#002F6C]"
          >
            <option value="name">이름</option>
            <option value="major">전공</option>
            <option value="tag">관심태그</option>
          </select>

          {/* 태그 검색인 경우 - 태그 선택 버튼 */}
          {searchType === "tag" ? (
            <button
              onClick={() => setShowTagModal(true)}
              className="flex-1 px-4 py-2 text-sm text-left border rounded-md hover:bg-gray-50 transition-colors"
            >
              {selectedTags.length > 0 ? (
                <span className="text-gray-900">
                  {selectedTags.length}개 태그 선택됨
                </span>
              ) : (
                <span className="text-gray-500">태그를 선택하세요</span>
              )}
            </button>
          ) : (
            /* 일반 검색 입력 */
            <input
              type="text"
              placeholder={
                searchType === "name"
                  ? "이름을 입력하세요"
                  : "전공을 입력하세요"
              }
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="flex-1 px-3 sm:px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#002F6C]"
            />
          )}

          {/* 검색 버튼 */}
          <button
            onClick={handleSearch}
            disabled={
              isSearching ||
              (searchType === "tag"
                ? selectedTags.length === 0
                : !keyword.trim())
            }
            className="px-4 sm:px-6 py-2 text-sm text-white bg-[#002F6C] rounded-md hover:bg-[#001f4d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {isSearching ? "검색 중..." : "🔍 검색"}
          </button>
        </div>

        {/* 선택된 태그 표시 */}
        {searchType === "tag" && selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-[#002F6C] border border-blue-200 rounded-full"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="text-[#002F6C] hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 태그 필터 모달 */}
      {showTagModal && (
        <TagFilterModal
          onClose={() => setShowTagModal(false)}
          onApply={(tags) => {
            setSelectedTags(tags);
            setShowTagModal(false);
          }}
        />
      )}

      {/* 검색 결과 */}
      {showResults && (
        <div className="mt-3 sm:mt-4">
          {searchResults.length > 0 ? (
            <>
              <p className="mb-3 text-xs sm:text-sm text-gray-600">
                총 <span className="font-semibold text-[#002F6C]">{totalCount}</span>명의
                사용자를 찾았습니다
              </p>
              <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((member) => (
                  <MatchingUserCard
                    key={member.memberId}
                    member={member}
                    showMatchInfo={false}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="p-6 sm:p-8 text-center bg-gray-50 rounded-lg">
              <p className="text-sm sm:text-base text-gray-500">검색 결과가 없습니다.</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                다른 키워드로 검색해보세요.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
