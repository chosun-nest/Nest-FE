/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAccessToken } from "../store/slices/authSlice";
import { setUser, selectCurrentUserId } from "../store/slices/userSlice";
import { getMemberProfile } from "../api/profile/ProfileAPI";
import {
  getProjectById,
  deleteProject,
  getApplicantsByProjectId,
} from "../api/project/ProjectAPI";

import CommentSection from "../components/project/comment/CommentSection";
import ApplicationModal from "../components/project/ApplicationModal";
import ConfirmModal from "../components/common/ConfirmModal";
import ParticipantCardBox from "../components/project/ParticipantCardBox";

import PostDetailInfo from "../components/project/detail/PostDetailInfo";
import PostDetailHeader from "../components/project/detail/PostDetailHeader";
import PostDetailTags from "../components/project/detail/PostDetailTags";
import FollowButton from "../components/project/detail/FollowButton";

import type { ProjectDetail } from "../types/api/project-board";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const accessToken = useSelector(selectAccessToken);
  const currentUserId = useSelector(selectCurrentUserId);

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [myApplicationStatus, setMyApplicationStatus] = useState<
    "WAITING" | "ACCEPTED" | "REJECTED" | "CANCELED" | null
  >(null);
  useEffect(() => {
    if (accessToken === undefined) return;

    const initialize = async () => {
      if (!accessToken) {
        setAuthError(true);
        setLoading(false);
        return;
      }

      try {
        const user = await getMemberProfile();
        dispatch(
          setUser({
            memberId: user.memberId,
            memberName: user.memberName,
            memberRole: user.memberRole,
          })
        );

        const data = await getProjectById(Number(id));
        setProject(data);

        if (user?.memberId && data?.projectId) {
          try {
            const applicants = await getApplicantsByProjectId(data.projectId);
            const found = applicants.find((a) => a.memberId === user.memberId);
            if (found) {
              setMyApplicationStatus(found.status);
              console.log("지원자 상태:", found.status);
            }
          } catch (err) {
            console.error("지원자 상태 조회 실패:", err);
          }
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          console.error("프로젝트 상세 조회 실패:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [id, accessToken]);

  const handleEdit = () => {
    if (!project) return;

    const partCounts: Record<string, number> = {};
    project.projectMembers.forEach((member) => {
      if (member.part) {
        partCounts[member.part] = (partCounts[member.part] || 0) + 1;
      }
    });

    navigate("/project-write", {
      state: {
        project: {
          ...project,
          partCounts,
        },
      },
    });
  };

  const handleDelete = async () => {
    try {
      await deleteProject(Number(id));
      setShowDeleteConfirm(false);
      alert("삭제 완료되었습니다.");
      navigate("/project-board");
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl px-4 pb-10 mx-auto text-center pt-36">
        ⏳ 로딩 중입니다...
      </div>
    );
  }

  if (authError) {
    return (
      <div className="max-w-4xl px-4 pb-10 mx-auto font-semibold text-center text-red-500 pt-36">
        🔒 로그인 후 프로젝트 정보를 확인할 수 있습니다.
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-4xl px-4 pb-10 mx-auto text-center text-gray-600 pt-36">
        ❌ 해당 프로젝트를 찾을 수 없습니다.
        <div className="mt-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm text-white rounded bg-slate-800"
          >
            ← 뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const isAuthor = project.author.id === currentUserId;

  const handleAuthorClick = () => {
    if (isAuthor) {
      navigate("/profile");
    } else {
      navigate(`/profile/${project.author.id}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-36 pb-10 flex flex-col lg:flex-row gap-8">
      {/* 왼쪽 본문 영역 */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-[#00256c] mb-4 break-words">
          {project.projectTitle}
        </h1>

        {/* 작성자 정보 + 버튼 */}
        <div className="flex items-start justify-between mb-6">
          <PostDetailInfo
            author={{
              id: project.author.id,
              name: project.author.name,
              profileImageUrl: "",
            }}
            isAuthor={isAuthor}
            createdAt={project.createdAt}
            viewCount={project.viewCount}
            onAuthorClick={handleAuthorClick}
          />

          <div className="flex items-center gap-2">
            {!isAuthor && <FollowButton memberId={project.author.id} />}
            <PostDetailHeader
              isAuthor={isAuthor}
              onEdit={handleEdit}
              onDelete={() => setShowDeleteConfirm(true)}
            />
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        {/* 내용 */}
        <div className="mb-6 leading-relaxed text-gray-700 whitespace-pre-line">
          {project.projectDescription}
        </div>

        {/* 태그 */}
        <PostDetailTags tags={project.tags} />

        {/* 댓글 */}
        <div className="px-5 py-4 mb-6 border rounded bg-gray-50">
          <CommentSection boardType="PROJECT" postId={project.projectId} />
        </div>

        {/* 뒤로가기 */}
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm text-white rounded bg-slate-800"
        >
          ← 뒤로 가기
        </button>
      </div>

      {/* 오른쪽 참여자 카드 */}
      <div className="w-full lg:w-[280px] shrink-0">
        <ParticipantCardBox
          project={project}
          participants={project.projectMembers}
          onOpenModal={() => setIsModalOpen(true)}
          currentUserId={currentUserId!}
          myApplicationStatus={myApplicationStatus}
        />
      </div>

      {/* 지원자 모달 */}
      {isModalOpen && (
        <ApplicationModal
          onClose={() => setIsModalOpen(false)}
          onAccept={() => {}}
        />
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <ConfirmModal
          title="프로젝트 삭제"
          message="정말 이 프로젝트를 삭제하시겠습니까?"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
