import { useEffect, useState, useRef } from "react";
import Navbar from "../components/layout/navbar";
import NoticeBoardSearch from "../components/notice/NoticeBoardSearch";
import NoticeDropdown from "../components/notice/NoticeDropdown";
import NoticeCard from "../components/notice/NoticeCard";
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
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
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
        if (category === "전체") {
          // 전체 데이터를 모두 가져온 후 프론트에서 페이지네이션
            const results = await Promise.all(
              CATEGORY_LIST.slice(1).map((cat) => 
              fetchNotices(cat, 0, 400)) // 충분한 크기로 가져오기
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

          setAllNotices(sorted);
          setTotalCount(sorted.length);
          setTotalPages(Math.ceil(sorted.length / noticesPerPage));
        } else {
          const res = await fetchNotices(category, currentPage - 1, noticesPerPage);
          const filtered = (res.notices || []).map((n) => ({
            ...n,
            category: normalize(category), // 카테고리 공백 제거
          }));

          setPagedNotices(filtered);

          const totalElements = filtered.length;

          setTotalCount(totalElements);
          setTotalPages(Math.ceil(totalElements / noticesPerPage));
        }
      } catch (err) {
        console.error("❌ 공지 불러오기 실패:", err);
      }
    };

    fetchData();
  }, [category, currentPage]);


  const getCurrentNotices = (): Notice[] => {
    if (category === "전체") {
      const start = (currentPage - 1) * noticesPerPage;
      return allNotices.slice(start, start + noticesPerPage);
    } else {
      return pagedNotices;
    }
  };

  // 페이지네이션 구현
  const renderPagination = () => {
    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        {/* 이전 버튼 */}
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-2 text-sm font-medium rounded border transition-colors
            ${currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
        >
          ← 이전
        </button>

        {/* 페이지 번호 */}
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-2 text-sm font-medium rounded border transition-colors
                  ${currentPage === pageNum
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 text-sm font-medium rounded border transition-colors
            ${currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
        >
          다음 →
        </button>
      </div>
    );
  };

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
              총 <strong>{totalCount}</strong>개의 게시물이 있습니다.
            </p>

            <div className="flex gap-2">
              <NoticeBoardSearch
                searchKeyword={searchKeyword}
                setSearchKeyword={setSearchKeyword}
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
        {totalPages > 1 && renderPagination()}
      </div>
    </>
  );
}
