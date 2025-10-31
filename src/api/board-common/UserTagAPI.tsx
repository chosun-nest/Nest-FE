// 태그 즐겨찾기 API - 회원 관심 태그 추가, 확인, 삭제, 조회 API
import { API } from "..";
import { getAccessToken } from "../../utils/auth";
import { AxiosError } from "axios";

// ===========================
// 타입 정의
// ===========================

export interface FavoriteTag {
  tagId: number;
  tagName: string;
}

export interface FavoriteTagsResponse {
  memberId: number;
  memberName: string;
  favoriteTags: FavoriteTag[];
}

// ===========================
// 인증 헤더 유틸리티
// ===========================
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getAccessToken()}`,
  },
});

// ===========================
// API 함수
// ===========================

// 회원 - 관심 태그 확인 (GET)
/**
 * 특정 태그가 사용자의 관심 태그인지 확인
 * @endpoint GET /api/v1/favorites/tags/{tagName}
 * @auth 필수 (JWT)
 * @param {string} tagName - 확인할 태그명
 * @returns {Promise<boolean>} true: 관심 태그, false: 아님
 * @throws {401} 인증 실패
 * @throws {403} 권한 없음
 */
export const checkFavoriteTag = async (tagName: string): Promise<boolean> => {
  try {
    const response = await API.get<boolean>(
      `/api/v1/favorites/tags/${encodeURIComponent(tagName)}`,
      authHeader()
    );
    return response.data;
  } catch (error) {
    // 404 에러는 false로 처리 (태그가 관심 목록에 없음)
    if (error instanceof AxiosError && error.response?.status === 404) {
      return false;
    }
    throw error;
  }
};

// 회원 - 관심 태그 추가 (POST)
/**
 * 사용자의 관심 태그 추가
 * @endpoint POST /api/v1/favorites/tags/{tagName}
 * @auth 필수 (JWT)
 * @param {string} tagName - 추가할 태그명
 * @returns {Promise<void>}
 * @throws {401} 인증 실패
 * @throws {403} 권한 없음 (Forbidden)
 * @throws {409} 이미 추가된 태그
 */

export const addFavoriteTag = async (tagName: string): Promise<void> => {
  await API.post(
    `/api/v1/favorites/tags/${encodeURIComponent(tagName)}`,
    null, // body 없음
    authHeader()
  );
};

// 회원 - 관심 태그 삭제 (DELETE)
/**
 * 사용자의 관심 태그 삭제
 * @endpoint DELETE /api/v1/favorites/tags/{tagName}
 * @auth 필수 (JWT)
 * @param {string} tagName - 삭제할 태그명
 * @returns {Promise<void>}
 * @throws {401} 인증 실패
 * @throws {403} 권한 없음
 * @throws {404} 태그를 찾을 수 없음
 */
export const removeFavoriteTag = async (tagName: string): Promise<void> => {
  await API.delete(
    `/api/v1/favorites/tags/${encodeURIComponent(tagName)}`,
    authHeader()
  );
};

// 회원 - 관심 태그 목록 조회 (GET)

/**
 * 현재 로그인한 사용자의 관심 태그 목록 조회
 * @endpoint GET /api/v1/favorites/tags
 * @auth 필수 (JWT)
 * @returns {Promise<FavoriteTagsResponse>} 회원 정보 및 관심 태그 배열
 * @throws {401} 인증 실패
 * @throws {403} 권한 없음
 */
export const getFavoriteTags = async (): Promise<FavoriteTagsResponse> => {
  const response = await API.get<FavoriteTagsResponse>(
    "/api/v1/favorites/tags",
    authHeader()
  );
  return response.data;
};

// ===========================
// 유틸리티 함수
// ===========================
/**
 * 관심 태그 토글 (추가 또는 삭제)
 * @param {string} tagName - 토글할 태그명
 * @returns {Promise<boolean>} true: 추가됨, false: 삭제됨
 */
export const toggleFavoriteTag = async (tagName: string): Promise<boolean> => {
  const isFavorite = await checkFavoriteTag(tagName);
  
  if (isFavorite) {
    await removeFavoriteTag(tagName);
    return false;
  } else {
    await addFavoriteTag(tagName);
    return true;
  }
};

/**
 * 여러 태그를 한 번에 추가 (배치 처리)
 * @param {string[]} tagNames - 추가할 태그명 배열
 * @returns {Promise<void>}
 */
export const addMultipleFavoriteTags = async (tagNames: string[]): Promise<void> => {
  await Promise.all(tagNames.map((tagName) => addFavoriteTag(tagName)));
};


/**
 * 특정 태그명이 관심 태그 목록에 포함되어 있는지 확인
 * @param {string} tagName - 확인할 태그명
 * @param {FavoriteTag[]} favoriteTags - 관심 태그 배열
 * @returns {boolean}
 */
export const isFavoriteTagInList = (
  tagName: string,
  favoriteTags: FavoriteTag[]
): boolean => {
  return favoriteTags.some((tag) => tag.tagName === tagName);
};
