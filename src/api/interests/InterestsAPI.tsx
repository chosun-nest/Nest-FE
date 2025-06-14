// [관심분야 정보 게시판] 게시글 API
import { API } from "..";
import {
  CreatePostPayload,
  CreatePostResponse,
  PostDetail,
  DeletePostResponse,
  UpdatePostRequest,
  UpdatePostResponse,
  PostListResponse,
  FetchPostsParams,
  ReactionType,
  ReactionResponse,
  SearchPostListResponse,
  SearchPostsParams
} from "../../types/api/interest-board";
import { getAccessToken } from "../../utils/auth";

// ✅ 공통 인증 헤더
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getAccessToken()}`,
  },
});

// =========================================
// [관심분야 게시판 글쓰기용 - board-write.tsx]
// =========================================

// 관심분야 게시글 작성 (POST) - 인증 필요
export const createInterestPost = async (
  payload: CreatePostPayload
): Promise<CreatePostResponse> => {
  const response = await API.post<CreatePostResponse>(
    "/api/v1/posts",
    payload,
    authHeader()
  );
  return response.data;
};

// =========================================
// [관심분야 게시글 상세 페이지용 - interests-detail.tsx]
// =========================================

// 게시글 상세 조회 (GET) - 인증 필요
export const fetchPostDetail = async (postId: number): Promise<PostDetail> => {
  const response = await API.get<PostDetail>(
    `/api/v1/posts/${postId}`,
    authHeader()
  );
  return response.data;
};

// 게시글 삭제 (DELETE) - 인증 필요
export const deletePost = async (postId: number): Promise<DeletePostResponse> => {
  const response = await API.delete<DeletePostResponse>(
    `/api/v1/posts/${postId}`,
    authHeader()
  );
  return response.data;
};

// 게시글 수정 요청 (PATCH) - 인증 필요
export const updatePost = async (
  postId: number,
  payload: UpdatePostRequest
): Promise<UpdatePostResponse> => {
  const response = await API.patch<UpdatePostResponse>(
    `/api/v1/posts/${postId}`,
    payload,
    authHeader()
  );
  return response.data; // postId, message
};

// =========================================
// [관심분야 게시판용 - interests-board.tsx]
// =========================================

// 게시글 목록 조회 (GET)
export const fetchPosts = async (
  params: FetchPostsParams
): Promise<PostListResponse> => {  
  const queryParams = new URLSearchParams();

  if (params.page !== undefined) 
    queryParams.append("page", String(params.page));
  if (params.size !== undefined) 
    queryParams.append("size", String(params.size));
  if (params.sort) 
    queryParams.append("sort", params.sort);
  if (params.tags && params.tags.length > 0) {
    params.tags.forEach((tag) => queryParams.append("tags", tag));
  }

  // 공개형 게시판이므로 인증 생략
  const response = await API.get<PostListResponse>(
    `/api/v1/posts?${queryParams.toString()}`,
    {
      headers: { skipAuth: true },
    }
  );
  return response.data;
};

// 게시글 좋아요/싫어요 반응 관리(토글 방식) (POST) - 인증 필요
export const reactToPost = async (
  postId: number,
  reactionType: ReactionType
): Promise<ReactionResponse> => {
  const response = await API.post<ReactionResponse>(
    `/api/v1/posts/${postId}/reaction`,
    { reactionType },
    authHeader()
  );
  return response.data;
};

// =========================================
// 게시글 검색 (GET) - 인증 불필요
export const searchPosts = async (
  params: SearchPostsParams
): Promise<SearchPostListResponse> => {
  const queryParams = new URLSearchParams();

  queryParams.append("keyword", params.keyword);
  if (params.searchType) 
    queryParams.append("searchType", params.searchType);
  if (params.page !== undefined) 
    queryParams.append("page", String(params.page));
  if (params.size !== undefined) 
    queryParams.append("size", String(params.size));
  if (params.sort) 
    queryParams.append("sort", params.sort);
  if (params.tags && params.tags.length > 0) {
    params.tags.forEach(tag => queryParams.append("tags", tag));
  }

  const response = await API.get<SearchPostListResponse>(
    `/api/v1/posts/search?${queryParams.toString()}`,
    {
      headers: { skipAuth: true },
    }
  );
  return response.data;
};
