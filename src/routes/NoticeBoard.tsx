import { useEffect, useState, useRef } from "react";
import Navbar from "../components/layout/navbar";
import NoticeBoardSearch from "../components/notice/NoticeBoardSearch";
import NoticeDropdown from "../components/notice/NoticeDropdown";
import NoticeCard from "../components/notice/NoticeCard";
import Pagination from "../components/interests/board/Pagination";
import { fetchNotices } from "../api/notices/NoticesAPI";  //API 연동

export interface Notice {
  number: string;
  title: string;
  writer: string;
  date: string;
  views: string;
  link: string;
  category?: string;
  deadline?: string;
}

const CATEGORY_LIST = [
  "전체",
  "일반공지",
  "학사공지",
  "장학공지",
  "SW중심대학사업단",
  "IT융합대학",
  "컴퓨터공학전공",
  "정보통신공학전공",
  "인공지능공학전공",
  "모빌리티SW전공",
];

// 공백 제거 정규화 함수
const normalize = (str: string) => str.replace(/\s+/g, "");

export default function NoticeBoard() {
  // 내비게이션 바 높이를 측정할 ref/state
  const navbarRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);

  // 카테고리·공지 목록·검색어 상태
  const [category, setCategory] = useState("전체");
  const [allNotices, setAllNotices] = useState<Notice[]>([]);
  const [pagedNotices, setPagedNotices] = useState<Notice[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  // const [, setIsLoading] = useState(false);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const noticesPerPage = 15;

  // mount 시점에 navbar 높이 계산
  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, [category]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("📥 공지사항 조회 시작:", { category });

        if (category === "전체") {
          // 전체 데이터를 모두 가져온 후 프론트에서 페이지네이션
          const results = await Promise.all(
            CATEGORY_LIST.slice(1).map(async (cat) => {
              console.log(`  📡 API 호출: ${cat}`);
              const result = await fetchNotices(cat, 0, 400);
              console.log(`  ✅ 응답: ${cat} - ${result.notices?.length || 0}개`);
              return result;
            })
          );

          const merged = results.flatMap((res, i) =>
            (res.notices || []).map((n) => ({
              ...n,
              category: normalize(CATEGORY_LIST[i + 1]),
            }))
          );

          const sorted = merged.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          console.log("✅ 전체 공지:", sorted.length);
          setAllNotices(sorted);
        } else {
          console.log(`📡 API 호출: ${category}, 전체 데이터 가져오기`);
          // 특정 카테고리도 모든 데이터를 한 번에 가져와서 프론트에서 페이지네이션
          const res = await fetchNotices(category, 0, 1000);
          console.log(`✅ 응답:`, res);

          const allCategoryNotices = (res.notices || []).map((n) => ({
            ...n,
            category: normalize(category), // 카테고리 공백 제거
          }));

          console.log(`✅ ${category} 전체 공지: ${allCategoryNotices.length}개`);
          setPagedNotices(allCategoryNotices);
        }
      } catch (err) {
        console.error("❌ 공지 불러오기 실패:", err);
        console.error("❌ 에러 상세:", err);
      }
    };

    fetchData();
    // currentPage는 의존성에서 제거 - 카테고리 변경시에만 API 호출
  }, [category]);


  // 검색어로 필터링된 공지사항 목록 가져오기
  const getFilteredNotices = (): Notice[] => {
    const sourceNotices = category === "전체" ? allNotices : pagedNotices;

    // 검색어가 없으면 전체 반환
    if (!searchKeyword.trim()) {
      return sourceNotices;
    }

    // 검색어로 필터링 (제목에서 검색)
    return sourceNotices.filter((notice) =>
      notice.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  };

  const getCurrentNotices = (): Notice[] => {
    const filtered = getFilteredNotices();
    const start = (currentPage - 1) * noticesPerPage;
    return filtered.slice(start, start + noticesPerPage);
  };

  // 검색 결과에 따른 총 개수와 페이지 수 계산
  const getDisplayStats = () => {
    const filtered = getFilteredNotices();
    return {
      totalCount: filtered.length,
      totalPages: Math.ceil(filtered.length / noticesPerPage),
    };
  };

  const displayStats = getDisplayStats();


  return (
    <>
      {/* 1) 최상단 네비게이션 바 */}
      <Navbar ref={navbarRef} />

      {/* 2) navHeight 만큼 상단 padding을 준 콘텐츠 영역 */}
      <div
        className="max-w-4xl min-h-screen p-4 mx-auto bg-white"
        style={{ paddingTop: navHeight + 20 }}
      >
        {/* 헤더 영역 */}
        <div className="px-1 mb-6">
          {/* 제목과 카테고리 필터 */}
          <div className="px-1 mb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#00256c]">공지사항 게시판</h2>

              {/* 카테고리 필터 드롭다운 */}
              <NoticeDropdown
                selected={category}
                onChange={(cat) => {
                  setCategory(cat);
                  setCurrentPage(1);
                  if (cat === "전체") {
                    setAllNotices([]);
                  } else {
                    setPagedNotices([]);
                  }
                }}
              />
            </div>
          </div>

          {/* 구분선 */}
          <hr className="mb-4 border-t border-gray-300" />

          {/* 게시물 수와 검색창 */}
          <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-700">
              총 <strong>{displayStats.totalCount}</strong>개의 게시물이 있습니다.
              {searchKeyword && ` (검색어: "${searchKeyword}")`}
            </p>

            <div className="flex gap-2">
              <NoticeBoardSearch
                searchKeyword={searchKeyword}
                setSearchKeyword={(keyword) => {
                  setSearchKeyword(keyword);
                  setCurrentPage(1); // 검색 시 첫 페이지로 이동
                }}
              />
            </div>
          </div>
        </div>

        {/* 공지 리스트 */}
        {getCurrentNotices().length > 0 ? (
          <div className="space-y-4">
            {getCurrentNotices().map((notice, idx) => (
              <NoticeCard key={idx} notice={notice} />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-gray-500">
            공지사항이 없습니다.
          </div>
        )}

        {/* 페이지네이션 */}
        {displayStats.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={displayStats.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </>
  );
}
