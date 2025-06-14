// [모든 게시판 공통] 댓글 API
import { API } from "..";
import {
  BoardType,
  CommentResponse,
  CommentPayload,
  CommentReactionRequest,
  CommentReactionResponse,
  DeleteCommentResponse,
  FetchCommentsResponse
} from "../../types/api/comments";
import { getAccessToken } from "../../utils/auth";

// ✅ 공통 인증 헤더
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getAccessToken()}`,
  },
});

// =========================================
// 댓글 목록 조회 (GET)
export const fetchComments = async (
  boardType: BoardType,
  postId: number
): Promise<FetchCommentsResponse> => {
  const res = await API.get<FetchCommentsResponse>(
    `/api/v1/${boardType}/${postId}/comments`,
    authHeader()
  );
  return res.data;
};

// =========================================
// 댓글 작성 (POST)
export const createComment = async (
  boardType: BoardType,
  postId: number,
  payload: CommentPayload
): Promise<CommentResponse> => {
  const res = await API.post<CommentResponse>(
    `/api/v1/${boardType}/${postId}/comments`,
    payload,
    authHeader()
  );
  return res.data;
};

// =========================================
// 대댓글 작성 (POST)
export const createReplyComment = async (
  boardType: BoardType,
  postId: number,
  parentId: number,
  payload: CommentPayload
): Promise<CommentResponse> => {
  const res = await API.post<CommentResponse>(
    `/api/v1/${boardType}/${postId}/comments/${parentId}/reply`,
    payload,
    authHeader()
  );
  return res.data;
};

// =========================================
// 댓글 좋아요/싫어요 반응 관리 (POST)
export const reactToComment = async (
  boardType: BoardType,
  postId: number,
  commentId: number,
  payload: CommentReactionRequest
): Promise<CommentReactionResponse> => {
  const res = await API.post<CommentReactionResponse>(
    `/api/v1/${boardType}/${postId}/comments/${commentId}/reaction`,
    payload,
    authHeader()
  );
  return res.data;
};

// =========================================
// 댓글/대댓글 삭제 (DELETE)
export const deleteComment = async (
  boardType: BoardType,
  postId: number,
  commentId: number
): Promise<DeleteCommentResponse> => {
  const res = await API.delete<DeleteCommentResponse>(
    `/api/v1/${boardType}/${postId}/comments/${commentId}`,
    authHeader()
  );
  return res.data;
};

// =========================================
// 댓글 수정 (PATCH)
export const updateComment = async (
  boardType: BoardType,
  postId: number,
  commentId: number,
  payload: CommentPayload
): Promise<CommentResponse> => {
  const res = await API.patch<CommentResponse>(
    `/api/v1/${boardType}/${postId}/comments/${commentId}`,
    payload,
    authHeader()
  );
  return res.data;
};

// 댓글 수정 (PATCH) -> skipAuth : false 적용 전 코드 형태
// export const updateComment = async (
//   boardType: BoardType,
//   postId: number,
//   commentId: number,
//   payload: CommentPayload   // await updateComment("PROJECT", 42, 123, { content: "댓글 수정 내용입니다." });
// ): Promise<CommentResponse> => {
//   const token = getAccessToken();
//   const res = await API.patch<CommentResponse>(
//     `/api/v1/${boardType}/${postId}/comments/${commentId}`,
//     payload,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,    // 일일히 Authorization에 토큰 붙였어야 했어야 했음.
//       },
//     }
//   );
//   return res.data;
// };
