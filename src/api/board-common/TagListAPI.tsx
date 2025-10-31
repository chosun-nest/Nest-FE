// 태그 api
import { API } from "..";

// ===========================
// 타입 객체
// ===========================

export interface Tag {
  tagId: number;
  tagName: string;
  category: string;
  categoryDisplayName: string;
  postCount: number;
}

export interface TagListResponse {
  tags: Tag[];
  tagCount: number;
}

export interface TagsByCategoryResponse {
  tags: Tag[];
  tagCount: number;
}

export type SingleTagResponse = Tag;

// ===========================
// API 객체
// ===========================

// 태그 리스트 반환 (GET)
/**
 * 전체 태그 리스트 반환
 * @endpoint GET /api/v1/tags
 * @auth 불필요
 * @returns {TagListResponse} 태그 배열 및 총 개수
 */
export const getAllTags = async (): Promise<TagListResponse> => {
  const res = await API.get<TagListResponse>("/api/v1/tags", {
    headers: { skipAuth: true },
  });
  return res.data;
};

// 특정 tagPathName 기반 태그 조회 (GET)
/**
 * 특정 태그명으로 태그 조회
 * @endpoint GET /api/v1/tags/{tagName}
 * @auth 불필요
 * @param {string} tagName - 조회할 태그명 (예: "풀스택", "웹개발")
 * @returns {SingleTagResponse} 단일 태그 정보
 * @throws {404} 태그를 찾을 수 없음
 */
export const getTagByName = async (tagName: string): Promise<SingleTagResponse> => {
  const res = await API.get<SingleTagResponse>(
    `/api/v1/tags/${encodeURIComponent(tagName)}`,
    {
      headers: { skipAuth: true },
    }
  );
  return res.data;
};

// 카테고리 별 태그 조회 (GET)
/**
 * 카테고리별 태그 리스트 조회
 * @endpoint GET /api/v1/tags/category/{categoryName}
 * @auth 불필요
 * @param {string} categoryName - 카테고리명 (예: "DEVELOPMENT_PROGRAMMING")
 * @returns {TagsByCategoryResponse} 카테고리에 속한 태그 배열
 * @throws {404} 카테고리를 찾을 수 없음
 */
export const getTagsByCategory = async (
  categoryName: string
): Promise<TagsByCategoryResponse> => {
  const res = await API.get<TagsByCategoryResponse>(
    `/api/v1/tags/category/${encodeURIComponent(categoryName)}`,
    {
      headers: { skipAuth: true },
    }
  );
  return res.data;
};

// ===========================
// 유틸리티 함수
// ===========================

/**
 * 카테고리 표시명을 path name으로 변환
 * @example "🖥️ 개발•프로그래밍" → "DEVELOPMENT_PROGRAMMING"
 */
export const getCategoryPathName = (displayName: string): string => {
  const categoryMap: Record<string, string> = {
    "🖥️ 개발•프로그래밍": "DEVELOPMENT_PROGRAMMING",
    "🤖 인공지능": "ARTIFICIAL_INTELLIGENCE",
    "🥼 데이터 사이언스": "DATA_SCIENCE",
    "🎮 게임 개발": "GAME_DEVELOPMENT",
    "🛡️ 보안•네트워크": "SECURITY_NETWORK",
    "💽 하드웨어": "HARDWARE",
    "🎨 디자인•아트": "DESIGN_ART",
  };
  return categoryMap[displayName] || "UNCATEGORIZED";
};

/**
 * 태그 이름으로 카테고리 찾기
 * @param {string} tagName - 태그명
 * @param {Tag[]} allTags - 전체 태그 배열
 * @returns {string} 카테고리 표시명
 */
export const getCategoryByTagName = (tagName: string, allTags: Tag[]): string => {
  const tag = allTags.find((t) => t.tagName === tagName);
  return tag?.categoryDisplayName || "미분류";
};

