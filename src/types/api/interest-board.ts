// [관심분야 정보 게시판] 게시글 API interface 및 type 분리

// =========================================
// [관심분야 게시판 글쓰기용 - board-write.tsx]
// =========================================
// 관심분야 게시글 작성 (POST)
export interface CreatePostPayload {  // BE, redux 사용자 처리 완료 후, uid 추가하기
  title: string;    
  content: string;  
  tags: string[];
}

export interface CreatePostResponse {
  postId: number;
  message: string;
}

// =========================================
// [관심분야 게시글 상세 페이지용 - interests-detail.tsx]
// =========================================

// 게시글 상세 조회 (GET)
export interface PostDetail {   // 응답
  postId: number;   // 게시글 ID
  title: string;    // 게시글 제목
  content: string;  // 게시글 본문 내용
  tags: string[];   // 태그 ex) ["JavaScript", "React"]
  author: {         // 작성자 정보
    id: number;
    name: string;
  };
  viewCount: number;    // 조회수
  likeCount: number;    // 좋아요수
  dislikeCount: number; // 싫어요수
  createdAt: string;    // 작성일자
  updatedAt: string;    // 수정일자
}

// 게시글 삭제 (DELETE)
export interface DeletePostResponse {
  postId: number;
  message: string;
}

// 게시글 수정 요청 (PATCH)
export interface UpdatePostRequest {
  title?: string | null;      // 수정된 제목
  content?: string | null;    // 수정된 본문
  tags?: string[] | null;     // 수정된 태그
}
export interface UpdatePostResponse {
  postId: number;
  message: string;
}

// =========================================
// [관심분야 게시판용 - interests-board.tsx]
// =========================================
export interface PostSummary {   // 게시글 요약 (게시글 카드)
  postId: number;               // 게시글 id
  title: string;            // 게시글 제목
  previewContent: string;   // 본문 미리보기
  author: {         // 작성자 정보
    id: number;
    name: string;
  };
  tags: string[];           // 태그
  viewCount: number;        // 조회수
  likeCount: number;        // 좋아요수
  dislikeCount: number;     // 싫어요수
  commentCount: number;     // 댓글 수
  createdAt: string;        // 작성 일자
}

export interface PageInfo {      // 페이지네이션(페이징 정보)
  pageNumber: number;       // 현재 페이지번호
  pageSize: number;         // 한 페이지에 표시되는 게시글 수
  totalPages: number;       // 전체 페이지 수
  totalElements: number;    // 전체 게시글 수
  first: boolean;           // 첫 페이지 여부
  last: boolean;            // 마지막 페이지 여부
  hasNext: boolean;         // 다음 페이지 있는지
  hasPrevious: boolean;     // 이전 페이지 있는지
}

export interface PostListResponse {  // 게시글 목록 & 페이징 정보 묶어서 받는 최종 응답
  posts: PostSummary[];     // 게시글 요약 객체 리스트
  totalCount: number;       // 전체 게시글 수
  pageInfo: PageInfo;       // 페이지 정보
}

export interface FetchPostsParams {  // 게시글 목록 요청할 때마다 전달하는 파라미터
  page?: number;            // 요청할 페이지 번호
  size?: number;            // 한 페이지 게시글 수
  sort?: string;            // 정렬 조건ex) "createdAt,desc"
  tags?: string[];          // 필터링할 태그 목록 ex) ["JAVA", "SPRING"]
}

export type ReactionType = "LIKE" | "DISLIKE";

export interface ReactionResponse {
  postId: number;
  likeCount: number;
  dislikeCount: number;
  message: string;  // 추가, 변경, 취소
}

// 게시글 검색 (GET)
export interface SearchPost {
  id: number;
  title: string;
  previewContent: string;
  author: {         // 작성자 정보
    id: number;
    name: string;
  };
  tags: string[];
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  createdAt: string;
}

export interface SearchPostListResponse {
  posts: SearchPost[];
  totalCount: number;
  pageInfo: PageInfo;
}

export type SearchType = "ALL" | "TITLE" | "CONTENT";

export interface SearchPostsParams {
  keyword: string;
  searchType?: SearchType;
  page?: number;
  size?: number;
  sort?: string;
  tags?: string[];
}
