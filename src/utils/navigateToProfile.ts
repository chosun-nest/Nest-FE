// 내 프로필이면 /profile, 타인이면 /profile/{id}로 이동
/**
 * 사용자 ID를 비교하여 내 프로필(/profile) 또는 타인 프로필(/profile/{id})로 이동
 * @param navigate - useNavigate()에서 가져온 함수
 * @param currentUserId - 현재 로그인한 사용자 ID
 * @param targetUserId - 클릭한 프로필의 사용자 ID
 */

import { NavigateFunction } from "react-router-dom";

export function navigateToProfile({
  navigate,
  currentUserId,
  targetUserId,
}: {
  navigate: NavigateFunction;
  currentUserId: number;
  targetUserId: number;
}) {
  if (currentUserId === targetUserId) {
    navigate("/profile");
  } else {
    navigate(`/profile/${targetUserId}`);
  }
}