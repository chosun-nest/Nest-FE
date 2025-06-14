import { useEffect, useState, useRef } from "react";
import Navbar from "../components/layout/navbar";
import NoticeBoardHeader from "../components/notice/NoticeBoardHeader";
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

          const totalElements =
            res.pageInfo?.totalElements || res.totalCount || filtered.length;

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
    const pagesPerGroup = 10;
    const currentGroup = Math.floor((currentPage - 1) / pagesPerGroup);
    const groupStart = currentGroup * pagesPerGroup + 1;
    const groupEnd = Math.min(groupStart + pagesPerGroup - 1, totalPages);

    const pageNumbers = [];
    for (let i = groupStart; i <= groupEnd; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 border rounded mx-1 ${
            i === currentPage
              ? "bg-nestblue text-white"
              : "bg-white text-black hover:bg-nestblue/80 hover:text-white"
          }`}
        >
          {i}
        </button>
      );
    }

  return (
    <div className="flex justify-center mt-6">
      {/* << 맨 앞 */}
      <button
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded mx-1 hover:bg-nestblue/80 hover:text-white"
      >
        ≪
      </button>

      {/* < 이전 페이지 */}
      <button
        type="button"
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded mx-1 hover:bg-nestblue/80 hover:text-white"
      >
        &lt;
      </button>

      {/* 페이지 목록 */}
      {pageNumbers}

      {/* > 다음 페이지 */}
      <button
        type="button"
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded mx-1 hover:bg-nestblue/80 hover:text-white"
      >
        &gt;
      </button>

      {/* >> 맨 끝 */}
      <button
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded mx-1 hover:bg-nestblue/80 hover:text-white"
      >
        ≫
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
        className="max-w-5xl mx-auto"
        style={{ padding: `${navHeight}px 24px` }}
      >
        {/* 제목 */}
        <NoticeBoardHeader />

        {/* 검색 */}
        <div className="max-w-5xl px-4 mx-auto">
          <NoticeDropdown selected={category} onChange={(cat) => {
            setCategory(cat);
            setCurrentPage(1);
            if (cat === "전체") {
              setAllNotices([]);
            } else {
              setPagedNotices([]);
            }
          }} />
          <NoticeBoardSearch
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
          />
          <hr className="my-4" />
          <p className="text-sm text-gray-700">
            총 <strong>{totalCount}</strong>개의 게시물이 있습니다.
          </p>
        </div>

        {/* 공지 리스트 */}
        <div className="mt-6">
          {getCurrentNotices().length > 0 ? (
            getCurrentNotices().map((notice, idx) => (
              <NoticeCard key={idx} notice={notice} />
            ))
          ) : (
            <p className="text-center text-gray-500">공지사항이 없습니다.</p>
          )}
        </div>

        {/*  페이지네이션 (공지 리스트 아래에) 표시 */}
        {totalPages > 1 && renderPagination()}
      </div>
    </>
  );
}
