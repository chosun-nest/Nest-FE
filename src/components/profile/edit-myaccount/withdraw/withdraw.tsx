// 계정 탈퇴
import {useState} from "react";
import { useDispatch } from "react-redux";
import { withdrawMember } from "../../../../api/profile/ProfileAPI";
import WithdrawModal from "./WithdrawModal";
import WithdrawCompleteModal from "./WithdrawCompleteModal";
import { clearTokens } from "../../../../store/slices/authSlice";

export default function Withdraw(){
  const dispatch = useDispatch();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);  // 탈퇴하기 버튼 누른 후 모달
  const [showCompleteModal, setShowCompleteModal] = useState(false);  // 탈퇴 완료 모달

  const handleWithdraw = async () => {
    try {
      await withdrawMember();
      localStorage.removeItem("accesstoken");
      localStorage.removeItem("refreshToken");
      dispatch(clearTokens());

      setShowWithdrawModal(false);
      setShowCompleteModal(true);
    } catch (err) {
      console.error("회원 탈퇴 실패", err);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="w-full px-4 py-2 text-white bg-gray-500 rounded sm:w-auto"
        >
          계정 탈퇴하기 &gt;
        </button>
      </div>

      {showWithdrawModal && (
        <WithdrawModal
          onClose={() => setShowWithdrawModal(false)}
          onConfirm={handleWithdraw}
        />
      )}

      {showCompleteModal && (
        <WithdrawCompleteModal onClose={() => setShowCompleteModal(false)} />
      )}
    </>
  );
}