import { API } from "..";
import { getAccessToken } from "../../utils/auth";
import {
  MemberFavoriteTagsResponse,
  CheckFavoriteTagResponse,
  FavoriteTagItem,
} from "../../types/api/favorite-tag";

// =========================================
// 특정 태그가 즐겨찾기인지 확인 (GET) - 인증 필요
// =========================================
export const checkFavoriteTag = async (
  tagName: string
): Promise<CheckFavoriteTagResponse> => {
  const token = getAccessToken();
  const encodedTag = encodeURIComponent(tagName.trim());

  const response = await API.get<CheckFavoriteTagResponse>(
    `/api/v1/favorites/tags/${encodedTag}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// =========================================
// 즐겨찾기 태그 목록 조회 (GET) - 인증 필요
// =========================================
export const getFavoriteTags =
  async (): Promise<MemberFavoriteTagsResponse> => {
    const token = getAccessToken();

    const response = await API.get<MemberFavoriteTagsResponse>(
      "/api/v1/favorites/tags",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };

// =========================================
// 태그 즐겨찾기 추가 (POST) - 인증 필요
// =========================================
export const addFavoriteTag = async (tagName: string): Promise<void> => {
  const token = getAccessToken();
  const encodedTag = encodeURIComponent(tagName.trim());

  await API.post(`/api/v1/favorites/tags/${encodedTag}`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// =========================================
// 태그 즐겨찾기 삭제 (DELETE) - 인증 필요
// =========================================
export const deleteFavoriteTag = async (tagName: string): Promise<void> => {
  const token = getAccessToken();
  const encodedTag = encodeURIComponent(tagName.trim());

  await API.delete(`/api/v1/favorites/tags/${encodedTag}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// =========================================
// 즐겨찾기 태그 이름 목록만 추출 (UI용 헬퍼 함수)
// =========================================
export const getFavoriteTagNames = async (): Promise<string[]> => {
  const data = await getFavoriteTags();
  return data.favoriteTags.map((item: FavoriteTagItem) => item.tagName);
};
