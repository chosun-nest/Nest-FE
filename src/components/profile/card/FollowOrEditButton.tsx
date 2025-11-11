// 프로필 카드 - 본인 : 프로필 수정 버튼 & 타인 : 팔로잉/팔로우 버튼
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showModal } from "../../../store/slices/modalSlice";
import useFollowStatus from "../../../hooks/useFollowStatus";

interface ProfileFollowButtonProps {
  isMine: boolean;
  memberId: number;
}

export default function ProfileActionButton({ isMine, memberId }: ProfileFollowButtonProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const commonButtonClasses = "w-[210px] py-2 rounded-md whitespace-nowrap font-bold transition border";
  const { isFollowing, follow, unfollow } = useFollowStatus(memberId);
  const [loading, setLoading] = useState(false); // 요청 중 여부

  const handleFollowToggle = async () => {
    if (loading) return; // 중복 방지
    setLoading(true);

    try {
      if (isFollowing) {
        await unfollow(); // 실패 시 상태 복구는 훅 내부에서 처리됨
      } else {
        await follow();
      }
    } catch {
      dispatch(
        showModal({
          title: "오류",
          message: "요청 처리 중 문제가 발생했습니다. 다시 시도해주세요.",
          type: "error",
        })
      );
    } finally {
      setLoading(false); // 항상 해제
    }
  };

  return (
    <div className="flex justify-center gap-2 mt-10">
      {isMine ? (
        <button
          onClick={() => navigate("/profile-edit")}
          className={`text-white bg-blue-900 ${commonButtonClasses}`}
        >
          프로필 수정
        </button>
      ) : (
        <button
          onClick={handleFollowToggle}
          disabled={loading} // 처리 중 버튼 비활성화
          className={`
            ${commonButtonClasses}
            ${
              isFollowing
          ? "bg-white text-[#1E3A8A] border-[#1E3A8A] hover:bg-[#f4f6fa]"
          : "bg-[#1E3A8A] text-white border-transparent hover:bg-[#5f7fce]"
            }
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "처리 중..." : isFollowing ? "UnFollow" : "Follow"}
        </button>
      )}
    </div>
  );
}