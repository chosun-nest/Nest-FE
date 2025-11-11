// 관심분야 게시판 - 팔로우 버튼
import { useState } from "react";
import { useDispatch } from "react-redux";
import useFollowStatus from "../../../hooks/useFollowStatus";
import { showModal } from "../../../store/slices/modalSlice";

interface FollowButtonProps {
  memberId: number;
}

export default function FollowButton({ memberId }: FollowButtonProps) {
  const dispatch = useDispatch();
  const { isFollowing, follow, unfollow } = useFollowStatus(memberId);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollow();
      } else {
        await follow();
      }
    } catch {
      dispatch(
        showModal({
          title: "error",
          message: "팔로우 상태 변경에 실패했습니다. 다시 시도해주세요.",
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`min-w-[100px] px-4 py-1.5 border rounded-md text-sm font-bold transition 
        ${
          isFollowing
            ? "bg-white text-[#1E3A8A] border-[#1E3A8A] hover:bg-[#f4f6fa]"
            : "bg-[#1E3A8A] text-white border-transparent hover:bg-[#5f7fce]"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {loading ? "처리 중..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
