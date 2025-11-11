import { API } from "..";
import { FollowListResponse } from "../../types/follow/follow";

export const follow = async (followingId: string) => {
  const res = await API.post<{ message: string }>(      // 타입 안정성 및 정확성을 위해 message 추가
    `/api/v1/follow`,
    { followingId },
    { headers: { skipAuth: false } }
  );
  return res.data;
};

export const unfollow = async (followingId: string) => {
  const res = await API.delete<{ message: string }>
  (`/api/v1/follow/${followingId}`, {
    headers: { skipAuth: false },
  });
  return res.data;
};

// 특정 사용자의 팔로잉 목록 조회 (GET)
export const checkOthersFollowings = async (memberId: string): Promise<FollowListResponse> => {
  const res = await API.get(`/api/v1/follow/${memberId}/following`, {
    headers: { skipAuth: false },
  });
  return res.data;
};

// 특정 사용자를 팔로워(팔로우하는) 목록 조회 (GET)
export const checkOthersFollowers = async (memberId: string): Promise<FollowListResponse> => {
  const res = await API.get(`/api/v1/follow/${memberId}/followers`, {
    headers: { skipAuth: false },
  });
  return res.data;
};

// 내가 팔로잉 하는 사용자 목록 조회 (GET)
export const checkMyFollowings = async (): Promise<FollowListResponse> => {
  const res = await API.get<FollowListResponse>(`/api/v1/follow/following`, {
    headers: { skipAuth: false },
  });
  return res.data;
};

// 내가 팔로우하는 사용자 목록 조회 (GET)
export const checkMyFollowers = async (): Promise<FollowListResponse> => {
  const res = await API.get(`/api/v1/follow/followers`, {
    headers: { skipAuth: false },
  });
  return res.data;
};