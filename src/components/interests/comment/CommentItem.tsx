// 3. 댓글, 대댓글 하나 렌더링
// 좋아요/싫어요
// 1-depth 대댓글 제한
// 더보기 등 핵심 기능 존재함!

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import clsx from "clsx";
import {
  deleteComment,
  updateComment,
  createReplyComment,
  reactToComment,
} from "../../../api/board-common/CommentAPI";
import { showModal } from "../../../store/slices/modalSlice";
import { selectCurrentUserId } from "../../../store/slices/userSlice";

import CommentForm from "./CommentForm";
import ReplyInput from "./comment-item/ReplyInput";
import ReplyList from "./comment-item/ReplyList";
import CommentActionMenu from "./comment-item/CommentActionMenu";
import ReactionButtons from "./comment-item/ReactionButtons";

import { navigateToProfile } from "../../../utils/navigateToProfile";
import { ArrowElbowDownRight } from "phosphor-react";
import type { CommentWithReplies, BoardType } from "../../../types/api/comments";

interface CommentItemProps {
  comment: CommentWithReplies;
  boardType: BoardType;
  postId: number;
  onRefresh: () => void;
  authorImageMap: Record<number, string>;
}

export default function CommentItem({
  comment,
  boardType,
  postId,
  onRefresh,
  authorImageMap,
}: CommentItemProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUserId = useSelector(selectCurrentUserId);

  const isReply = !!comment.parentId;

  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const isMenuOpen = openMenuId === comment.commentId;

  const handleDelete = async () => {
    try {
      await deleteComment(boardType, postId, comment.commentId);
      onRefresh();
    } catch {
      dispatch(showModal({ title: "삭제 실패", message: "댓글 삭제 중 오류 발생", type: "error" }));
    }
  };

  const handleUpdate = async (content: string) => {
    try {
      await updateComment(boardType, postId, comment.commentId, { content });
      setIsEditing(false);
      onRefresh();
    } catch {
      dispatch(showModal({ title: "수정 실패", message: "댓글 수정 중 오류 발생", type: "error" }));
    }
  };

  const handleReply = async (content: string) => {
    const cleanContent = content.replace(/^@\S+\s/, "");
    const replyContent = `@${comment.author.name} ${cleanContent}`;
    try {
      await createReplyComment(boardType, postId, comment.commentId, { content: replyContent });
      setIsReplying(false);
      onRefresh();
    } catch {
      dispatch(showModal({ title: "답글 실패", message: "답글 작성 중 오류 발생", type: "error" }));
    }
  };

  const handleReaction = async (type: "LIKE" | "DISLIKE") => {
    try {
      await reactToComment(boardType, postId, comment.commentId, { reactionType: type });
      onRefresh();
    } catch {
      dispatch(showModal({ title: "반응 실패", message: "좋아요/싫어요 중 오류 발생", type: "error" }));
    }
  };

  const extractMentionAndContent = (content: string) => {
    const match = content.match(/^@(\S+)\s(.*)/);
    if (!match) return { mention: null, content };
    return { mention: match[1], content: match[2] };
  };

  const formatContent = () => {
    const { mention, content: body } = extractMentionAndContent(comment.content);
    return (
      <>
        {mention && <span className="font-semibold text-[#1E3A8A]">@{mention}</span>} {body}
      </>
    );
  };

  return (
<div className={clsx("w-full", isReply && "bg-gray-50 border-l-2 border-blue-200")}>
  <div className="py-2">
    <div className="flex items-start gap-2">
      
      {/* ↳ 답글 아이콘 (대댓글일 때만 왼쪽에 표시) */}
      {isReply && (
        <div className="flex flex-col items-center min-w-[40px] pt-1 pl-1 text-[#1E3A8A]">
          <div className="flex items-center gap-1 text-xs font-semibold">
            <ArrowElbowDownRight size={14} />
            <span>답글</span>
          </div>
        </div>
      )}

      {/* 프로필 + 내용 전체 */}
      <div className="flex items-start flex-1 gap-3">
        {/* 프로필 이미지 */}
        <img
          src={ authorImageMap[comment.author.id] || "/assets/images/user.png"}  // comment.author.id 조회해서 profile.ts에 있는 MemberProfile 중 memberImageUrl 사용해야 할 것 같음.
          alt="작성자"
          className="object-cover w-10 h-10 rounded-full cursor-pointer"
          onClick={() =>
            navigateToProfile({
              navigate,
              currentUserId: currentUserId!,
              targetUserId: comment.author.id,
            })
          }
        />

        {/* 내용 본문 */}
        <div className="flex flex-col flex-1">
          {/* 작성자 + 시간 + 메뉴 */}
          <div className="flex items-start justify-between">
            <div
              className="cursor-pointer"
              onClick={() =>
                navigateToProfile({
                  navigate,
                  currentUserId: currentUserId!,
                  targetUserId: comment.author.id,
                })
              }
            >
              <div className="text-sm font-semibold">{comment.author.name}</div>
              <div className="text-xs text-gray-500">
                {comment.createdAt.slice(0, 16).replace("T", " ")}
              </div>
            </div>

            <CommentActionMenu
              authorId={comment.author.id}
              onEdit={() => {
                setIsEditing(true);
                setOpenMenuId(null); // 메뉴 닫기
              }}
              onDelete={async () => {
                await handleDelete();
                setOpenMenuId(null);
              }}
              isOpen={isMenuOpen}
              onOpen={() => setOpenMenuId(comment.commentId)}
              onClose={() => setOpenMenuId(null)}
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
                    const newContent = mention ? `@${mention} ${updatedContent}` : updatedContent;
                    handleUpdate(newContent);
                  }}
                  onCancel={() => setIsEditing(false)}
                  isLoggedIn={true}
                />
              </div>
            ) : comment.isDeleted ? (
              <i className="text-gray-400">삭제된 댓글입니다.</i>
            ) : (
              formatContent()
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
                  authorImageMap={authorImageMap}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
