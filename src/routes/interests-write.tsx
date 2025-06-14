// 관심분야 정보 게시판 글쓰기 페이지
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/layout/navbar";
import TagFilterModal from "../components/board/tag/TagFilterModal";
import BoardTypeSelector from "../components/board/write/BoardTypeSelector";
import BoardTagFilterButton from "../components/board/tag/BoardTagFilterButton";
import TitleInput from "../components/board/write/TitleInput";
import MarkdownEditor from "../components/board/write/MarkdownEditor";
import SubmitButtons from "../components/board/write/SubmitButtons";
import Modal from "../components/common/modal";
import { ModalContent } from "../types/modal";
import {
  createInterestPost,
  updatePost,
} from "../api/interests/InterestsAPI";
import type { PostDetail } from "../types/api/interest-board";

export default function InterestWrite() {
  const navigate = useNavigate();
  const location = useLocation();
  const navbarRef = useRef<HTMLDivElement>(null);

  const postToEdit = location.state?.post as PostDetail | undefined;
  const isEditMode = !!postToEdit;

  const [navHeight, setNavHeight] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string | undefined>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent>({
    title: "",
    message: "",
    type: "info",
  });

  const defaultContent = `[관심분야 정보 예시]

# AI 시대 개발자들의 놀이터 '허깅페이스'
## 1. 허깅 페이스란?

## 2. 허깅 페이스 핵심 서비스들 보기

## 3. 허깅 페이스 활용 사례`;

  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    if (!isEditMode) setContent(defaultContent);
  }, []);

  useEffect(() => {
    if (isEditMode && postToEdit) {
      setTitle(postToEdit.title);
      setContent(postToEdit.content);
      setSelectedTags(postToEdit.tags);
    }
  }, [isEditMode]);

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

    try {
      if (isEditMode && postToEdit) {
        await updatePost(postToEdit.postId, { title, content, tags: selectedTags });
        setModalContent({
          title: "수정 완료",
          message: "게시글이 수정되었습니다.",
          type: "info",
          onClose: () => {
            setShowModal(false);
            navigate(`/interests-detail/${postToEdit.postId}`);
          },
        });
      } else {
        await createInterestPost({ title, content, tags: selectedTags });
        setModalContent({
          title: "게시 완료",
          message: "게시글이 등록되었습니다.",
          type: "info",
          onClose: () => {
            setShowModal(false);
            navigate("/interests-board");
          },
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
      <div className="max-w-4xl mx-auto px-4 mt-[40px]" style={{ paddingTop: navHeight }}>
        <BoardTypeSelector boardType="interests" />
        <div className="p-3 mb-4 text-sm border-l-4 border-blue-600 rounded bg-blue-50">
          <strong>관심분야 정보 예시를 참고해 작성해주세요.</strong><br />
          최신 관심분야에 대한 정보를 정확하게 입력해주세요.
        </div>

        <TitleInput title={title} setTitle={setTitle} boardType="interests" />
        <MarkdownEditor content={content} setContent={setContent} />

        <div className="mb-6">
          <BoardTagFilterButton
            selectedTags={selectedTags}
            onRemoveTag={(tag) => setSelectedTags((prev) => prev.filter((t) => t !== tag))}
            onOpenFilter={() => setShowFilterModal(true)}
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
    </>
  );
}
