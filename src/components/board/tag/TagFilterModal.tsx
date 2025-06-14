import { useEffect, useState } from "react";
import {
  getAllTags,
  getTagByPath,
  getTagsByCategory,
  type Tag,
} from "../../../api/board-common/TagListAPI";
import { useDebounce } from "../../../hooks/useDebounce"; // npm install lodash

interface TagFilterModalProps {
  onClose: () => void;
  onApply: (selectedTags: string[]) => void;
}

export default function TagFilterModal({
  onClose,
  onApply,
}: TagFilterModalProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300); // 300초 디바운스
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);

  // 전체 태그 불러오기
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllTags();
        setAllTags(res.tags);
      } catch (e) {
        console.error("태그 목록 불러오기 실패", e);
      }
    })();
  }, []);

  // 태그 선택/제거
  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagName)) {
        setErrorMessage("");
        return prev.filter((t) => t !== tagName);
      } else {
        if (prev.length >= 10) {
          setErrorMessage("⚠️ 최대 10개의 관심분야만 선택할 수 있습니다.");
          return prev;
        }
        setErrorMessage("");
        return [...prev, tagName];
      }
    });
  };

  const removeTag = (tagName: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tagName));
  };

  // 검색 처리 : 디바운싱된 검색어로만 요청함
  useEffect(() => {
    const query = debouncedSearch.trim().toLowerCase();

    if (!query || query.length < 2) {
      setFilteredTags([]);
      return;
    }

    const localMatches = allTags.filter(
      (tag) =>
        tag.tagName.toLowerCase().includes(query) ||
        tag.categoryDisplayName.toLowerCase().includes(query)
    );

    // API 보조 검색
    const fetchRemote = async () => {
      try {
        const [tagResult, categoryResult] = await Promise.allSettled([
          getTagByPath(query),
          getTagsByCategory(query),
        ]);

        const apiTagMatches: Tag[] =
          tagResult.status === "fulfilled" ? [tagResult.value] : [];

        const apiCategoryMatches: Tag[] =
          categoryResult.status === "fulfilled"
            ? categoryResult.value.tags
            : [];

        const combined = [
          ...localMatches,
          ...apiTagMatches,
          ...apiCategoryMatches,
        ];
        const unique = Array.from(
          new Map(combined.map((tag) => [tag.tagName, tag])).values()
        );

        setFilteredTags(unique);
      } catch (err) {
        console.error("검색 중 오류 발생:", err);
        setFilteredTags(localMatches); // 로컬 필터만이라도 사용
      }
    };

    fetchRemote();
  }, [debouncedSearch, allTags]);

  // 카테고리별 그룹화
  const groupedTags = allTags.reduce(
    (acc, tag) => {
      const key = tag.categoryDisplayName;
      if (!acc[key]) acc[key] = [];
      acc[key].push(tag);
      return acc;
    },
    {} as Record<string, Tag[]>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pt-16 bg-black/40">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg relative max-h-[70vh] flex flex-col overflow-hidden">
        <button
          onClick={onClose}
          className="absolute z-10 text-xl text-gray-400 top-4 right-4 hover:text-black"
        >
          ×
        </button>

        {/* 스크롤 영역 */}
        <div className="flex-1 p-8 overflow-y-auto pb-36">
          <h2 className="text-xl font-bold mb-4 text-[#002F6C]">관심분야</h2>

          {/* 선택된 태그 표시 */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 text-sm border rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-gray-500 hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 검색 입력 */}
          <input
            type="text"
            placeholder="관심분야 검색"
            className="w-full p-3 mb-2 border rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filteredTags.length > 0) {
                e.preventDefault(); // 기본 폼 제출 방지
                toggleTag(filteredTags[0].tagName); // 첫 번째 태그 선택
              }
            }}
          />

          {/* 경고 메시지 */}
          {errorMessage && (
            <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
          )}

          {/* 검색 결과 */}
          {search.trim() !== "" && (
            <div className="mt-6 mb-6">
              <p className="font-semibold text-[15px] mb-2">🔍 검색 결과</p>
              {filteredTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {filteredTags.map((tag) => (
                    <button
                      key={tag.tagId}
                      onClick={() => toggleTag(tag.tagName)}
                      className={`px-3 py-1 rounded-full border text-sm transition ${
                        selectedTags.includes(tag.tagName)
                          ? "bg-[#002F6C] text-white border-[#002F6C]"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {tag.tagName}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">관련 태그가 없습니다.</p>
              )}
            </div>
          )}

          <div className="mt-6">
            {Object.entries(groupedTags).map(([category, tags]) => (
              <div key={category} className="mb-6">
                <p className="font-semibold text-[15px] mb-2">{category}</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.tagId}
                      onClick={() => toggleTag(tag.tagName)}
                      className={`px-3 py-1 rounded-full border text-sm transition ${
                        selectedTags.includes(tag.tagName)
                          ? "bg-[#002F6C] text-white border-[#002F6C]"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {tag.tagName}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="absolute bottom-0 left-0 flex justify-between w-full px-8 py-4 bg-white border-t rounded-b-xl">
          <button
            className="w-full px-4 py-3 mr-2 text-gray-700 border rounded hover:bg-gray-100"
            onClick={() => setSelectedTags([])}
          >
            ⟳ 초기화
          </button>
          <button
            className="w-full px-4 py-3 ml-2 text-white bg-[#002F6C] rounded hover:bg-[#001f4d]"
            onClick={() => onApply(selectedTags)}
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
}
