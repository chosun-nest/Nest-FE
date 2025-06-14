// 태그 api
import { API } from "..";

// ===========================
// 타입 객체
// ===========================

export interface Tag {
  tagId: number;
  tagName: string;
  tagPathName: string;
  category: string;
  categoryDisplayName: string;
  categoryPathName: string;
}

export interface TagListResponse {
  tags: Tag[];
  tagCount: number;
}

export interface TagsByCategoryResponse {
  tags: Tag[];
}

export type SingleTagResponse = Tag;

// ===========================
// API 객체
// ===========================

// 전체 태그 목록 (GET)
export const getAllTags = async (): Promise<TagListResponse> => {
  const res = await API.get<TagListResponse>("/api/v1/tags", {
    headers: { skipAuth: true }, // 인증 불필요
  });
  return res.data;
};

// 특정 tagPathName 기반 태그 조회 (GET)
export const getTagByPath = async (tagPathName: string): Promise<SingleTagResponse> => {
  const res = await API.get<SingleTagResponse>(
    `/api/v1/tags/${encodeURIComponent(tagPathName)}`,
    {
      headers: { skipAuth: true }, // 인증 불필요
    }
  );
  return res.data;
};

// 카테고리 별 태그 조회 (GET)
export const getTagsByCategory = async (
  categoryPathName: string
): Promise<TagsByCategoryResponse> => {
  const res = await API.get<TagsByCategoryResponse>(
    `/api/v1/tags/category/${encodeURIComponent(categoryPathName)}`,
    {
      headers: { skipAuth: true }, // 인증 불필요
    }
  );
  return res.data;
};
