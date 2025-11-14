/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../store/slices/authSlice";
import { getProjects, searchProjects } from "../api/project/ProjectAPI";
import type { ProjectSummary } from "../types/api/project-board";
import BoardWriteButton from "../components/board/write/BoardWriteButton";
import useResponsive from "../hooks/responsive";
import SelectedTagList from "../components/board/tag/SelectedTagList";
import TagFilterModal from "../components/board/tag/TagFilterModal";
import Pagination from "../components/interests/board/Pagination";

const ITEMS_PER_PAGE = 8;

type FilterType = "ALL" | "RECRUITING" | "COMPLETED";

export default function ProjectBoard() {
  const navigate = useNavigate();
  const isMobile = useResponsive();
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = !!accessToken;

  const [currentPage, setCurrentPage] = useState(1);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>("ALL");

  const fetchData = async () => {
    try {
      const baseParams = {
        page: currentPage - 1,
        size: ITEMS_PER_PAGE,
        sort: "createdAt,desc",
        tags: selectedTags,
      };

      let data;
      if (searchKeyword.trim() !== "") {
        data = await searchProjects({
          ...baseParams,
          keyword: searchKeyword,
          searchType: "ALL",
        });
      } else {
        data = await getProjects(baseParams);
      }

      let filtered = data.projects;
      if (filterType === "RECRUITING") {
        filtered = filtered.filter((p) => p.isRecruiting);
      } else if (filterType === "COMPLETED") {
        filtered = filtered.filter((p) => !p.isRecruiting);
      }

      setProjects(filtered);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("프로젝트 목록 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    fetchData();
  }, [isAuthenticated, currentPage, searchKeyword, selectedTags, filterType]);

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= Math.ceil(totalCount / ITEMS_PER_PAGE)) {
      setCurrentPage(page);
    }
  };

  const handleRowClick = (project: ProjectSummary) => {
    navigate(`/project/${project.projectId}`, { state: { project } });
  };

  const removeSelectedTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div
      className={`mx-auto min-h-screen p-4 pt-24 bg-white ${isMobile ? "max-w-full" : "max-w-4xl"}`}
    >
      {/* 헤더 영역 */}
      <div className="px-1 mb-6">
        {/* 제목과 필터 버튼 */}
        <div className="px-1 mb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#00256c]">프로젝트 모집 게시판</h2>

            {/* 필터 버튼 */}
            <div className="flex gap-2">
              {(["ALL", "RECRUITING", "COMPLETED"] as FilterType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setFilterType(type);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 text-sm rounded border font-semibold ${
                    filterType === type
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {type === "ALL"
                    ? "전체"
                    : type === "RECRUITING"
                      ? "모집중"
                      : "모집완료"}
                </button>
              ))}
            </div>
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
            <input
              type="text"
              placeholder="제목 또는 내용 검색"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-sm border rounded w-full sm:w-[300px]"
            />
            <button
              onClick={() => setShowFilterModal(true)}
              className="px-3 py-2 text-sm text-gray-700 bg-gray-100 border rounded hover:bg-gray-200"
            >
              🔍 태그 선택
            </button>
          </div>
        </div>

        {/* 선택된 태그 */}
        <SelectedTagList
          selectedTags={selectedTags}
          onRemoveTag={removeSelectedTag}
        />
      </div>

      {/* 태그 모달 */}
      {showFilterModal && (
        <TagFilterModal
          onClose={() => setShowFilterModal(false)}
          onApply={(tags) => {
            setSelectedTags(tags);
            setCurrentPage(1);
            setShowFilterModal(false);
          }}
        />
      )}

      {/* 게시글 목록 */}
      {projects.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          표시할 게시글이 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.projectId}
              onClick={() => handleRowClick(project)}
              className="p-4 border rounded-lg cursor-pointer hover:shadow"
            >
              <div className="flex items-center justify-start gap-2 mb-2">
                <span
                  className={`px-2 py-1 text-sm font-semibold border rounded-full ${
                    project.isRecruiting
                      ? "text-sky-700 bg-sky-100 border-sky-300"
                      : "text-gray-500 bg-gray-100 border-gray-300"
                  }`}
                >
                  {project.isRecruiting ? "모집중" : "모집완료"}
                </span>
                <h2
                  className={`font-semibold ${isMobile ? "text-base" : "text-lg"}`}
                >
                  {project.projectTitle}
                </h2>
              </div>
              <p className="mb-2 text-sm text-gray-700">
                {project.previewContent.length > 100
                  ? `${project.previewContent.slice(0, 100)}...`
                  : project.previewContent}
              </p>
              <div className="flex flex-wrap gap-2 mb-2">
                {[...new Set(project.tags)].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs text-gray-600 bg-gray-100 border border-gray-300 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  {project.author.name} · {project.createdAt}
                </span>
                <div className="flex gap-3">
                  <span>조회수 {project.viewCount}</span>
                  <span>댓글수 {project.commentCount}</span>
                  <span>모집인원 {project.currentNumberOfMembers}/{project.maximumNumberOfMembers}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageClick}
        />
      )}

      <BoardWriteButton />
    </div>
  );
}
