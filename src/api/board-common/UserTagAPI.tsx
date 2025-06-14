import { API } from "..";
import { getAccessToken } from "../../utils/auth";

// ✅ 공통 인증 헤더
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getAccessToken()}`,
  },
});

//
// 관심 태그 관련 API
//

// 회원 관심 태그 확인 (GET)
// 해당 태그가 사용자의 관심 태그인지 확인함
export const checkFavoriteTag = async (tagName: string): Promise<boolean> => {
  const response = await API.get<boolean>(
    `/api/v1/favorites/tags/${encodeURIComponent(tagName)}`,
    authHeader()
  );
  return response.data;
};

// 회원 관심 태그 추가 (POST)
export const addFavoriteTag = async (tagName: string): Promise<void> => {
  await API.post(
    `/api/v1/favorites/tags/${encodeURIComponent(tagName)}`,
    null,
    authHeader()
  );
};

// 회원 관심 태그 삭제 (DELETE)
export const removeFavoriteTag = async (tagName: string): Promise<void> => {
  await API.delete(
    `/api/v1/favorites/tags/${encodeURIComponent(tagName)}`,
    authHeader()
  );
};

// 회원 관심 태그 목록 조회 (GET)
// 현재 로그인한 사용자의 관심 태그 목록을 반환
interface FavoriteTag {
  tagId: number;
  tagName: string;
}

interface FavoriteTagsResponse {
  memberId: number;
  memberName: string;
  favoriteTags: FavoriteTag[];
}

export const getFavoriteTags = async (): Promise<FavoriteTagsResponse> => {
  const response = await API.get<FavoriteTagsResponse>(
    "/api/v1/favorites/tags",
    authHeader()
  );
  return response.data;
};
