import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
//import { useSelector } from "react-redux";
//import { selectCurrentUserName } from "../store/slices/userSlice";
import Navbar from "../components/layout/navbar";
import BoardTypeSelector from "../components/board/write/BoardTypeSelector";
import TagFilterModal from "../components/board/tag/TagFilterModal";
import SelectedTagList from "../components/board/tag/SelectedTagList";
//import BoardTagFilterButton from "../components/board/tag/BoardTagFilterButton";
import TitleInput from "../components/board/write/TitleInput";
import MarkdownEditor from "../components/board/write/MarkdownEditor";
import SubmitButtons from "../components/board/write/SubmitButtons";
import Modal from "../components/common/modal";
import { ModalContent } from "../types/modal";
import { createProjectPost, updateProject } from "../api/project/ProjectAPI";
import RecruitRoleList from "../components/project/RecruitRoleList";
import { getMemberProfile } from "../api/profile/ProfileAPI";
import type { ProjectDetail } from "../types/api/project-board";

interface RecruitCardData {
  id: number;
  role: string;
  authorName: string;
}

export default function ProjectWrite() {
  const navigate = useNavigate();
  const location = useLocation();
  
  //const reduxAuthorName = useSelector(selectCurrentUserName);

  const navbarRef = useRef<HTMLDivElement>(null);

  const projectToEdit = location.state?.project as ProjectDetail | undefined;
  const isEditMode = Boolean(projectToEdit);

  const [navHeight, setNavHeight] = useState(0);
  const [finalAuthorName, setFinalAuthorName] = useState("모집중");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [recruitCards, setRecruitCards] = useState<RecruitCardData[]>([]);
  const [kickedMemberIds, setKickedMemberIds] = useState<number[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    getMemberProfile()
      .then((user) => {
        setFinalAuthorName(user.memberName || "모집중");
      })
      .catch(() => setFinalAuthorName("모집중"));
  }, []);

  useEffect(() => {
    if (isEditMode && projectToEdit) {
      setTitle(projectToEdit.projectTitle);
      setContent(projectToEdit.projectDescription);
      setSelectedTags(projectToEdit.tags);
    } else {
      setContent(
        `[개발 프로젝트 모집 예시]\n\n- 프로젝트 주제: \n- 프로젝트 목표: \n- 예상 프로젝트 일정(횟수):`
      );
    }
  }, [isEditMode, projectToEdit]);

  const handleKickMember = (id: number) => {
    setKickedMemberIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      setModalContent({
        title: "입력 누락",
        message: "제목과 내용을 입력해주세요.",
        type: "error",
      });
      setShowModal(true);
      return;
    }

    const partCounts = recruitCards.reduce(
      (acc, { role }) => {
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const payload = {
      projectTitle: title,
      projectDescription: content,
      isRecruiting: true,
      tags: selectedTags,
      partCounts,
      ...(isEditMode && { membersToRemove: kickedMemberIds }), // ✅ 추방할 멤버 포함
    };

    try {
      if (isEditMode && projectToEdit) {
        await updateProject(projectToEdit.projectId, payload);
        setModalContent({
          title: "수정 완료",
          message: "게시글이 성공적으로 수정되었습니다.",
          type: "info",
          onClose: () => navigate(`/project/${projectToEdit.projectId}`),
        });
      } else {
        await createProjectPost({
          ...payload,
          creatorPart: recruitCards[0]?.role || "BACKEND",
          creatorRole: "LEADER",
          maximumNumberOfMembers: Object.values(partCounts).reduce(
            (sum, c) => sum + c,
            0
          ),
        });
        setModalContent({
          title: "게시 완료",
          message: "게시글이 등록되었습니다. 프로젝트 게시판에서 확인하세요.",
          type: "info",
          onClose: () => navigate("/project-board"),
        });
      }
      setShowModal(true);
    } catch (e) {
      console.error(e);
      setModalContent({
        title: "등록 실패",
        message: "게시글 등록에 실패했습니다.",
        type: "error",
      });
      setShowModal(true);
    }
  };

  return (
    <>
      <Navbar ref={navbarRef} />
      <div
        className="max-w-6xl mx-auto px-4 mt-[40px]"
        style={{ paddingTop: navHeight }}
      >
        <BoardTypeSelector boardType="projects" />
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex-1">
            <div className="p-3 mb-4 text-sm border-l-4 border-blue-600 rounded bg-blue-50">
              <strong>프로젝트 모집 예시를 참고해 작성해주세요.</strong>
              <br />
              꼼꼼히 작성하면 멋진 프로젝트 팀원을 만날 수 있을 거예요.
            </div>
            <TitleInput
              title={title}
              setTitle={setTitle}
              boardType="projects"
            />
            <MarkdownEditor content={content} setContent={setContent} />

            {/* 태그 리스트 표시 */}
            <SelectedTagList
              selectedTags={selectedTags}
              onRemoveTag={(tag) => setSelectedTags((prev) => prev.filter((t) => t !== tag))}
            />

            {/* 태그 필터 모달 열기 버튼 */}
            <div className="mt-2">
              <button
                onClick={() => setShowFilterModal(true)}
                className="px-3 py-2 text-sm text-gray-700 bg-gray-100 border rounded hover:bg-gray-200"
              >
                🔍 태그 선택
              </button>
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
            {showModal && (
              <Modal
                {...modalContent}
                onClose={() => {
                  setShowModal(false);
                  modalContent.onClose?.();
                }}
              />
            )}
            <SubmitButtons
              onCancel={() => navigate(-1)}
              onSubmit={handleSubmit}
              submitLabel={isEditMode ? "수정 완료" : undefined}
            />
          </div>
          <div className="w-full md:w-[300px]">
            <RecruitRoleList
              onChange={setRecruitCards}
              authorName={finalAuthorName}
              defaultMembers={projectToEdit?.projectMembers?.map((member) => ({
                memberName: member.memberName ?? "",
                part: member.part,
                memberId: member.memberId,
              }))}
              onKickMember={handleKickMember}
            />
          </div>
        </div>
      </div>
    </>
  );
}
