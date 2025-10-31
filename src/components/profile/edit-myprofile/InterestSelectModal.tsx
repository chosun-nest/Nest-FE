import { useEffect, useState } from "react";
import {
  getAllTags,
  getTagByName,
  getTagsByCategory,
  type Tag,
} from "../../../api/board-common/TagListAPI";
import {
  getFavoriteTags,
  addFavoriteTag,
  removeFavoriteTag,
} from "../../../api/board-common/UserTagAPI";
import { useDebounce } from "../../../hooks/useDebounce";

interface InterestSelectModalProps {
  onClose: () => void;
  onApply: (selectedInterests: string[]) => void;
  currentInterests: string[];
}

export default function InterestSelectModal({
  onClose,
  onApply,
  currentInterests,
}: InterestSelectModalProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(currentInterests);
  const [initialInterests, setInitialInterests] = useState<string[]>(currentInterests); // 초기 관심분야 저장
  const [errorMessage, setErrorMessage] = useState("");
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 전체 태그 및 즐겨찾기 태그 불러오기
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const [tagsRes, favoritesRes] = await Promise.allSettled([
          getAllTags(),
          getFavoriteTags(),
        ]);

        if (tagsRes.status === "fulfilled") {
          setAllTags(tagsRes.value.tags);
        }

        // currentInterests가 비어있으면 서버에서 불러온 즐겨찾기 사용
        if (favoritesRes.status === "fulfilled" && currentInterests.length === 0) {
          const favoriteTagNames = favoritesRes.value.favoriteTags.map(
            (tag) => tag.tagName
          );
          setSelectedInterests(favoriteTagNames);
          setInitialInterests(favoriteTagNames);
        }
      } catch (e) {
        console.error("태그 목록 불러오기 실패", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [currentInterests]);

  // 관심분야 선택/제거
  const toggleInterest = (tagName: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(tagName)) {
        setErrorMessage("");
        return prev.filter((t) => t !== tagName);
      } else {
        if (prev.length >= 7) {
          setErrorMessage("⚠️ 최대 7개의 관심분야만 선택할 수 있습니다.");
          return prev;
        }
        setErrorMessage("");
        return [...prev, tagName];
      }
    });
  };

  const removeInterest = (tagName: string) => {
    setSelectedInterests((prev) => prev.filter((t) => t !== tagName));
    setErrorMessage("");
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
          getTagByName(query),
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
        setFilteredTags(localMatches);
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
          <h2 className="text-xl font-bold mb-4 text-[#002F6C]">관심분야 선택</h2>
          <p className="mb-4 text-sm text-gray-600">최대 7개까지 선택 가능합니다</p>

          {/* 선택된 관심분야 표시 */}
          {selectedInterests.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedInterests.map((interest) => (
                <div
                  key={interest}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-[#002F6C] text-white border border-[#002F6C] rounded-full"
                >
                  {interest}
                  <button
                    onClick={() => removeInterest(interest)}
                    className="text-white hover:text-red-300"
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
                toggleInterest(filteredTags[0].tagName); // 첫 번째 태그 선택
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
                      onClick={() => toggleInterest(tag.tagName)}
                      className={`px-3 py-1 rounded-full border text-sm transition ${
                        selectedInterests.includes(tag.tagName)
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

          {/* 카테고리별 태그 목록 */}
          <div className="mt-6">
            {Object.entries(groupedTags).map(([category, tags]) => (
              <div key={category} className="mb-6">
                <p className="font-semibold text-[15px] mb-2">{category}</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.tagId}
                      onClick={() => toggleInterest(tag.tagName)}
                      className={`px-3 py-1 rounded-full border text-sm transition ${
                        selectedInterests.includes(tag.tagName)
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
            onClick={() => {
              setSelectedInterests([]);
              setErrorMessage("");
            }}
          >
            ⟳ 초기화
          </button>
          <button
            className="w-full px-4 py-3 ml-2 text-white bg-[#002F6C] rounded hover:bg-[#001f4d] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={async () => {
              setIsLoading(true);

              try {
                // 변경사항 계산
                const interestsToAdd = selectedInterests.filter(
                  (interest) => !initialInterests.includes(interest)
                );
                const interestsToRemove = initialInterests.filter(
                  (interest) => !selectedInterests.includes(interest)
                );

                // 서버에 변경사항 저장
                await Promise.all([
                  ...interestsToAdd.map((interest) => addFavoriteTag(interest)),
                  ...interestsToRemove.map((interest) => removeFavoriteTag(interest)),
                ]);

                console.log("✅ 관심분야 서버 저장 완료:", selectedInterests);
              } catch (e) {
                console.error("❌ 관심분야 저장 실패", e);
                alert("관심분야 저장에 실패했습니다. 다시 시도해주세요.");
              } finally {
                setIsLoading(false);
                // 에러가 나든 안 나든 UI는 업데이트
                onApply(selectedInterests);
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? "저장 중..." : "적용"}
          </button>
        </div>
      </div>
    </div>
  );
}
