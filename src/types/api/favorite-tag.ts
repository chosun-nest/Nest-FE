// 태그 즐겨찾기 API

// 개별 태그
export interface FavoriteTagItem {
  tagId: number;
  tagName: string;
}

// 관심 태그 목록 조회 (GET)
export interface MemberFavoriteTagsResponse {
  memberId: number; // 현재 로그인한 회원 ID
  memberName: string; // 현재 로그인한 회원 이름
  favoriteTags: FavoriteTagItem[]; // 즐겨찾기 태그 리스트
}

// 특정 태그 즐겨찾기 여부 확인
export type CheckFavoriteTagResponse = boolean;
