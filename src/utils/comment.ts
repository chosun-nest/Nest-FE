// utils/comment.ts
import type { RawComment, CommentWithReplies } from "../types/api/comments";

// 1-depth children을 replies로 변환
export function convertChildrenToReplies(comments: RawComment[]): CommentWithReplies[] {
  return comments.map((comment) => ({
    ...comment,
    replies: (comment.children ?? []).map((child) => ({
      ...child,
      replies: [], // 하위 children은 무시 (1-depth까지만 처리)
    })),
  }));
}