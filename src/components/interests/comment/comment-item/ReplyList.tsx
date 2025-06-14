//

import CommentItem from "../CommentItem";
import type { CommentWithReplies, BoardType } from "../../../../types/api/comments";

interface ReplyListProps {
  replies: CommentWithReplies[];
  boardType: BoardType;
  postId: number;
  onRefresh: () => void;
}

export default function ReplyList({ replies, boardType, postId, onRefresh }: ReplyListProps) {
  return (
    <div className="mt-3 space-y-4">
      {replies.map((reply) => (
        <CommentItem
          key={`reply-${reply.commentId}`}
          comment={reply}
          boardType={boardType}
          postId={postId}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}