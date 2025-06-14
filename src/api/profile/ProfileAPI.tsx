import {
  MemberProfile,
  UpdateMemberProfilePayload,
  CheckPasswordPayload,
  UpdateMemberPasswordPayload,
} from "../../types/api/profile";

import { API } from "..";
import { getAccessToken } from "../../utils/auth";

// 공통 인증 헤더
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getAccessToken()}`,
  },
});

//
// 프로필 관련 API
//

// 프로필 이미지 업로드 (POST)
export const uploadProfileImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await API.post("/api/v1/members/me/image", formData, authHeader());
  return res.data.imageUrl;
};

// 비밀번호 확인 (POST)
export const checkPassword = async (payload: CheckPasswordPayload) => {
  return API.post("/api/v1/members/check-password", payload, {
    ...authHeader(),
    validateStatus: (status) => status < 500,
  });
};

// 회원 정보 조회 (GET)
export const getMemberProfile = async (): Promise<MemberProfile> => {
  const res = await API.get("/api/v1/members/me", authHeader());
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  return {
    ...res.data,
    memberImageUrl: res.data.memberImageUrl
      ? `${BASE_URL}${res.data.memberImageUrl}`
      : "",
  };
};

// 회원 탈퇴 (DELETE)
export const withdrawMember = async (): Promise<{ message: string }> => {
  const res = await API.delete("/api/v1/members/me", authHeader());
  return res.data;
};

// 회원 정보 수정 (PATCH)
export const updateMemberProfile = async (
  payload: UpdateMemberProfilePayload
) => {
  return await API.patch("/api/v1/members/me", payload, authHeader());
};

// 비밀번호 변경 (PATCH)
export const updateMemberPassword = async (
  payload: UpdateMemberPasswordPayload
): Promise<{ message: string }> => {
  const res = await API.patch("/api/v1/members/me/password", payload, authHeader());
  return res.data;
};

//
// ✅ 인증 관련 API
//

// 토큰 유효성 검사 (GET)
export const checkTokenValidity = async (): Promise<{ memberId: number }> => {
  const res = await API.get("/api/v1/auth/me", authHeader());
  return res.data;
};

//
// ✅ 기술 스택 / 학과 관련 API (공개 API)
//

// 기술 스택 목록 조회 (GET)
export const getTech = async () => {
  const res = await API.get("/api/v1/tech-stacks", {
    headers: { skipAuth: true },
  });
  return res.data;
};

// 학과 전체 조회 (GET)
export const getDepartments = async () => {
  const res = await API.get("/api/v1/departments", {
    headers: { skipAuth: true },
  });
  return res.data;
};

//
// ✅ 관심 태그 관련 API
//

// 관심 태그 목록 조회 (GET)
export const getFavoriteTags = async (): Promise<
  { tagId: number; tagName: string }[]
> => {
  const res = await API.get("/api/v1/favorites/tags", authHeader());
  return res.data.favoriteTags;
};

// 관심 태그 추가
export const addFavoriteTag = async (tagName: string): Promise<void> => {
  await API.post(
    `/api/v1/favorites/tags/${encodeURIComponent(tagName)}`,
    null,
    authHeader()
  );
};

// 관심 태그 삭제
export const deleteFavoriteTag = async (tagName: string): Promise<void> => {
  await API.delete(
    `/api/v1/favorites/tags/${encodeURIComponent(tagName)}`,
    authHeader()
  );
};
