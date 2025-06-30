// 3단계 : 유저 항목 컴포넌트
// 4단계 : 모달 통합 테스트 및 상태 동기화 : ProfileCard.tsx - followerCount / followingCount 연동
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../../store/slices/userSlice";
import useFollowStatus from "../../../hooks/useFollowStatus";
import type { FollowUser } from "../../../types/follow/follow";
import { useState } from "react";

interface FollowUserItemProps {
  user: FollowUser;
  onFollowChange?: () => void;
}

export default function FollowUserItem({ user, onFollowChange }: FollowUserItemProps) {
  const navigate = useNavigate();
  const { isFollowing, follow, unfollow } = useFollowStatus(user.memberId);
  const [loading, setLoading] = useState(false);

  const currentUserId = useSelector(selectCurrentUserId);
  const isMyself = currentUserId === user.memberId;

  const handleFollowToggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollow();
      } else {
        await follow();
      }
      onFollowChange?.(); // 부모에게 알림
    } catch (err) {
      console.error("팔로우 상태 변경 실패", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate(`/profile/${user.memberId}`)}
      >
        <img
          src={user.memberImageUrl || "/assets/images/user.png"}
          alt="profile"
          className="object-cover w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold">{user.memberName}</p>
          
        </div>
      </div>

      {!isMyself && (
        <button
          onClick={handleFollowToggle}
          disabled={loading}
          className={`text-sm px-4 py-1.5 rounded-md font-semibold border transition ${
            isFollowing
              ? "bg-white text-[#1E3A8A] border-[#1E3A8A] hover:bg-[#f4f6fa]"
              : "bg-[#1E3A8A] text-white border-transparent hover:bg-[#5f7fce]"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "처리 중..." : isFollowing ? "팔로잉" : "팔로우"}
        </button>
      )}
    </div>
  );
}
