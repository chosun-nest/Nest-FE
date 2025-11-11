export interface FollowUser {
  memberId: number;
  memberName: string;
  memberImageUrl: string;
  memberIntroduce: string;
  memberIsStudent: boolean;
  followedAt: string; // ISO string, 필요시 Date 변환
}

export interface FollowListResponse {
  users: FollowUser[];
  totalCount: number;
  message: string;
}

export interface FollowRequestPayload {
  followingId: number;
}