// 관심분야 정보 게시판 메인 페이지
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../store/slices/authSlice";

import Navbar from "../components/layout/navbar";
import InterestBoardSearch from "../components/interests/board/InterestBoardSearch";
import BoardTagFilterButton from "../components/board/tag/BoardTagFilterButton";
import SelectedTagList from "../components/board/tag/SelectedTagList";
import TagFilterModal from "../components/board/tag/TagFilterModal";
import InterestBoardSortTabs from "../components/interests/board/InterestBoardSortTabs";
import InterestPostCardList from "../components/interests/board/InterestPostCardList";
import InterestBoardWriteButton from "../components/board/write/BoardWriteButton";
import Pagination from "../components/interests/board/Pagination";

import { fetchPosts, searchPosts } from "../api/interests/InterestsAPI";
import type { PostSummary, SearchPost } from "../types/api/interest-board";

import Modal from "../components/common/modal";
import type { ModalContent } from "../types/modal";

export default function InterestBoard() {
  const [navHeight, setNavHeight] = useState(0);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortType, setSortType] = useState<"latest" | "likes">("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const navbarRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = !!accessToken;

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });

  const handleCardClick = (postId: number) => {
    if (isAuthenticated) {
      navigate(`/interests-detail/${postId}`);
    } else {
      setModalContent({
        title: "로그인이 필요합니다",
        message: "게시글을 보려면 먼저 로그인해주세요.",
        type: "info",
        onClose: () => {
          setShowModal(false);
          navigate("/login");
        },
      });
      setShowModal(true);
    }
  };

  const fetchData = async () => {
    try {
      const params = {
        page: currentPage - 1,
        size: pageSize,
        sort: sortType === "likes" ? "likeCount,desc" : "createdAt,desc",
        tags: selectedTags,
      };

      let rawPosts: (PostSummary | SearchPost)[] = [];
      let total = 0;

      if (searchKeyword.trim() === "") {
        const data = await fetchPosts(params);
        rawPosts = data.posts;
        total = data.totalCount;
      } else {
        const data = await searchPosts({
          ...params,
          keyword: searchKeyword,
          searchType: "ALL",
        });
        rawPosts = data.posts;
        total = data.totalCount;
      }

      const mappedPosts: PostSummary[] = rawPosts
        .map((post, idx) => {
          const converted: PostSummary = {
            postId: "postId" in post ? post.postId : post.id,
            title: post.title,
            previewContent: post.previewContent,
            author: post.author,
            tags: post.tags ?? [],
            createdAt: post.createdAt,
            viewCount: post.viewCount ?? 0,
            likeCount: post.likeCount ?? 0,
            dislikeCount: post.dislikeCount ?? 0,
            commentCount: post.commentCount ?? 0,
          };

          if (!converted.postId) {
            console.warn(`❗ ${idx}번째 게시글에 postId 없음`, post);
          }

          return converted;
        })
        .filter((post) => !!post.postId);

      setPosts(mappedPosts);
      setTotalCount(total);
    } catch (err) {
      console.error("❌ 게시글 목록 조회 실패", err);
    }
  };

  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentPage, selectedTags, sortType, searchKeyword]);

  const removeSelectedTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <>
      <Navbar ref={navbarRef} />
      <div
        className="max-w-4xl min-h-screen p-4 mx-auto bg-white"
        style={{ paddingTop: navHeight + 20 }}
      >
        
      <div className="px-1 mb-6">
        {/* 제목, 정렬버튼(최신순, 좋아요순) */}
        <div className="px-1 mb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#00256c]">관심분야 정보 게시판</h2>
            <InterestBoardSortTabs sortType={sortType} onChange={setSortType} />
          </div>
        </div>

        {/* 구분선 */}
        <hr className="mb-4 border-t border-gray-300" />

        {/* 게시물 수, 검색창, 태그 버튼 */}
        <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-700">
            총 <strong>{totalCount}</strong>개의 게시물이 있습니다.
          </p>

          <div className="flex gap-2">
            <InterestBoardSearch
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
            />
            <BoardTagFilterButton onOpenFilter={() => setShowFilterModal(true)} />
          </div>
        </div>
        {/* 태그 리스트 */}
        <SelectedTagList
          selectedTags={selectedTags}
          onRemoveTag={removeSelectedTag}
        />
      </div>

        {showFilterModal && (
          <TagFilterModal
            onClose={() => setShowFilterModal(false)}
            onApply={(tags) => {
              setSelectedTags(tags);
              setShowFilterModal(false);
            }}
          />
        )}

        <InterestPostCardList posts={posts} onCardClick={handleCardClick} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <InterestBoardWriteButton />

        {showModal && (
          <Modal
            title={modalContent.title}
            message={modalContent.message}
            type={modalContent.type}
            onClose={modalContent.onClose}
          />
        )}
      </div>
    </>
  );
}
