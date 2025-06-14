// 2. 댓글 차상위 컴포넌트
// buildCommentTree()로 1-depth만 구성 후 CommentItem 리스트 렌더링
import CommentItem from "./CommentItem";
import type { CommentWithReplies, BoardType } from "../../../types/api/comments";

interface CommentListProps {
  comments: CommentWithReplies[];
  boardType: BoardType;
  postId: number;
  onRefresh: () => void;
}

export default function CommentList({
  comments,
  boardType,
  postId,
  onRefresh,
}: CommentListProps) {
  return (
    <div className="mt-6 space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={`root-${comment.commentId}`}
          comment={comment}
          boardType={boardType}
          postId={postId}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}

