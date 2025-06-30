// 대댓글 목록
import CommentItem from "../CommentItem";
import { useCommentAuthorProfiles } from "../../../../hooks/useCommentAuthorProfiles";
import type { CommentWithReplies, BoardType } from "../../../../types/api/comments";

interface ReplyListProps {
  replies: CommentWithReplies[];
  boardType: BoardType;
  postId: number;
  onRefresh: () => void;
  authorImageMap: Record<number, string>; // 사용자 id, imageurl 전달
}

export default function ReplyList({ replies, boardType, postId, onRefresh }: ReplyListProps) {
  const authorImageMap = useCommentAuthorProfiles(replies);   // 작성자 이미지 가져오기
  
  return (
    <div className="mt-3 space-y-4">
      {replies.map((reply) => (
        <CommentItem
          key={`reply-${reply.commentId}`}
          comment={reply}
          boardType={boardType}
          postId={postId}
          onRefresh={onRefresh}
          authorImageMap={authorImageMap}  // 대댓글도 이미지 전달하게 함
        />
      ))}
    </div>
  );
}