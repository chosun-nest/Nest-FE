// 1. 관심분야 정보 게시판 댓글 전체 랜더링 컨트롤 (댓글 최상위 컴포넌트)
import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { showModal } from "../../../store/slices/modalSlice";
import {
  fetchComments,
  createComment,
} from "../../../api/board-common/CommentAPI";
import type { CommentWithReplies, BoardType } from "../../../types/api/comments";
import { convertChildrenToReplies } from "../../../utils/comment";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import SkeletonComment from "./SkeletonComment";

export default function CommentSection({ boardType, postId }: { boardType: BoardType; postId: number }) {
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const memberId = Number(localStorage.getItem("memberId"));
  const isLoggedIn = !Number.isNaN(memberId);

  // 1. API 응답은 RawComment[]
  // 2. RawComment는 children?: RawComment[]
  // 3. 우리는 replies: CommentWithReplies[] 구조로 렌더링
  // 4. 따라서 children 필드는 무시하고 parentId 기반으로 replies를 수동 생성

  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchComments(boardType, postId);
      console.log("💬 댓글 원본 응답", res.comments);

      const tree = convertChildrenToReplies(res.comments); // 유틸 함수로 트리 생성
      setComments(tree);
    } catch (error) {
      console.error("댓글 불러오기 실패", error);
      dispatch(
        showModal({
          title: "댓글 불러오기 실패",
          message: "댓글 목록을 불러오는 중 오류가 발생했습니다.",
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  }, [boardType, postId, dispatch]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleAddComment = async (content: string) => {
    if (!isLoggedIn) {
      dispatch(
        showModal({
          title: "로그인 필요",
          message: "댓글을 작성하려면 로그인 해주세요.",
          type: "error",
        })
      );
      return;
    }

    try {
      await createComment(boardType, postId, { content });
      await new Promise((res) => setTimeout(res, 300));
      await loadComments();
    } catch (error) {
      console.error("댓글 작성 실패", error);
      dispatch(
        showModal({
          title: "댓글 작성 실패",
          message: "댓글 작성 중 오류가 발생했습니다.",
          type: "error",
        })
      );
    }
  };

  return (
    <div className="w-full mt-10 overflow-x-hidden">
      <h3 className="mb-4 text-lg font-semibold">댓글</h3>
      <CommentForm
        onSubmit={handleAddComment}
        isLoggedIn={isLoggedIn}
        placeholder="댓글을 입력하세요"
      />
      {loading ? (
        <SkeletonComment />
      ) : (
        <CommentList
          comments={comments}
          postId={postId}
          boardType={boardType}
          onRefresh={loadComments}
        />
      )}
    </div>
  );
}
