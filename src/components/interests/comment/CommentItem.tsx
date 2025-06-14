// 3. 댓글, 대댓글 하나 렌더링
// 좋아요/싫어요
// 1-depth 대댓글 제한
// 더보기 등 핵심 기능 존재함!

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
//import { useDispatch, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  deleteComment,
  updateComment,
  createReplyComment,
  reactToComment,
} from "../../../api/board-common/CommentAPI";
import { showModal } from "../../../store/slices/modalSlice";
//import { selectCurrentUserId } from "../../../store/slices/userSlice";
import CommentForm from "./CommentForm";
import ReplyInput from "./comment-item/ReplyInput";
import ReplyList from "./comment-item/ReplyList";
import CommentActionMenu from "./comment-item/CommentActionMenu";
import ReactionButtons from "./comment-item/ReactionButtons";
import { ArrowElbowDownRight } from "phosphor-react";
import type { CommentWithReplies, BoardType } from "../../../types/api/comments";

interface CommentItemProps {
  comment: CommentWithReplies;
  boardType: BoardType;
  postId: number;
  onRefresh: () => void;
}

export default function CommentItem({
  comment,
  boardType,
  postId,
  onRefresh,
}: CommentItemProps) {
  const dispatch = useDispatch();
  //const currentUserId = useSelector(selectCurrentUserId);
  //const isReply = comment.parentId && comment.parentId > 0;
  const isReply = !!comment.parentId;

  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteComment(boardType, postId, comment.commentId);
      onRefresh();
    } catch {
      dispatch(
        showModal({
          title: "삭제 실패",
          message: "댓글 삭제 중 오류 발생",
          type: "error",
        })
      );
    }
  };

  const handleUpdate = async (content: string) => {
    try {
      await updateComment(boardType, postId, comment.commentId, { content });
      setIsEditing(false);
      onRefresh();
    } catch {
      dispatch(
        showModal({
          title: "수정 실패",
          message: "댓글 수정 중 오류 발생",
          type: "error",
        })
      );
    }
  };

  const handleReply = async (content: string) => {
    const cleanContent = content.replace(/^@\S+\s/, "");
    const replyContent = `@${comment.author.name} ${cleanContent}`;
    try {
      await createReplyComment(boardType, postId, comment.commentId, {
        content: replyContent,
      });
      setIsReplying(false);
      onRefresh();
    } catch {
      dispatch(
        showModal({
          title: "답글 실패",
          message: "답글 작성 중 오류 발생",
          type: "error",
        })
      );
    }
  };

  const handleReaction = async (type: "LIKE" | "DISLIKE") => {
    try {
      await reactToComment(boardType, postId, comment.commentId, {
        reactionType: type,
      });
      onRefresh();
    } catch {
      dispatch(
        showModal({
          title: "반응 실패",
          message: "좋아요/싫어요 중 오류 발생",
          type: "error",
        })
      );
    }
  };

  const formatContent = (content: string) => {
    const { mention, content: body } = extractMentionAndContent(content);
    return (
      <>
        {mention && (
          <span className="font-semibold text-[#1E3A8A]">@{mention}</span>
        )}{" "}
        {body}
      </>
    );
  };

  const extractMentionAndContent = (content: string) => {   // 멘션 고정용 : 멘션 & 본문 분리 유틸 함수
    const match = content.match(/^@(\S+)\s(.*)/);
    if (!match) return { mention: null, content };
    return { mention: match[1], content: match[2] };
  };

  return (
    <div className={`w-full ${ isReply ? "pl-6 bg-gray-50 border-l-2 border-blue-200" : "" }`}>
      <div className="flex gap-3 py-3">
        <img
          src="/default-profile.png"
          alt="profile"
          className="object-cover w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          {isReply && (
            <div className="flex items-center gap-1 mb-2 text-sm text-[#1E3A8A]">
              <ArrowElbowDownRight size={18} className="text-[#1E3A8A]" />
              <span className="text-xs font-semibold tracking-tight">답글</span>
            </div>
          )}

          {/* 작성자 + 시간 + 메뉴 */}
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-semibold text-black">{comment.author.name}</span>
            <span className="mx-1">·</span>
            <span>{comment.createdAt.slice(0, 16).replace("T", " ")}</span>

            <CommentActionMenu
              authorId={comment.author.id}
              onEdit={() => setIsEditing(true)}
              onDelete={handleDelete}
            />
          </div>

          {/* 댓글 내용 */}
          <div className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">
            {isEditing ? (
              <div className="space-y-1">
                {comment.content.startsWith("@") && (
                  <div className="text-sm font-semibold text-[#1E3A8A]">
                    @{extractMentionAndContent(comment.content).mention}
                  </div>
                )}

                <CommentForm
                  initialValue={extractMentionAndContent(comment.content).content}
                  onSubmit={(updatedContent) => {
                    const mention = extractMentionAndContent(comment.content).mention;
                    const newContent = mention
                      ? `@${mention} ${updatedContent}`
                      : updatedContent;
                    handleUpdate(newContent);
                  }}
                  onCancel={() => setIsEditing(false)}
                  isLoggedIn={true}
                />
              </div>
            ) : comment.isDeleted ? (
              <i className="text-gray-400">삭제된 댓글입니다.</i>
            ) : (
              formatContent(comment.content)
            )}
          </div>

          {/* 좋아요/싫어요/답글 */}
          {!comment.isDeleted && (
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <ReactionButtons
                likeCount={comment.likeCount}
                dislikeCount={comment.dislikeCount}
                onReact={handleReaction}
              />
              {!isReply && (
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="ml-4 hover:underline"
                >
                  {isReplying ? "취소" : "답글"}
                </button>
              )}
            </div>
          )}

          {/* 답글 입력창 */}
          <AnimatePresence initial={false}>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ReplyInput
                  mentionName={comment.author.name}
                  onSubmit={handleReply}
                  onCancel={() => setIsReplying(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 대댓글 목록 */}
          <AnimatePresence initial={false}>
            {comment.replies.length > 0 && (
              <motion.div
                key="replies"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ReplyList
                  replies={comment.replies}
                  boardType={boardType}
                  postId={postId}
                  onRefresh={onRefresh}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
