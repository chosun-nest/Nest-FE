import React, {useState} from "react";
import WithdrawModal from "./modal/withdraw-modal";
import WithdrawCompleteModal from "./modal/withdraw-complete-modal";

export default function Withdraw(){
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);  // 탈퇴하기 버튼 누른 후 모달
  const [showCompleteModal, setShowCompleteModal] = useState(false);  // 탈퇴 완료 모달
  
  return (
    <>
      <div className="text-right mb-4">
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          계정 탈퇴하기 &gt;
        </button>
      </div>

      { /* 계정 탈퇴 모달 띄우기 */}
      {showWithdrawModal && (
        <WithdrawModal
          onClose={() => setShowWithdrawModal(false)}
          onConfirm={() => {
            console.log("탈퇴 처리");
            setShowWithdrawModal(false);
            setShowCompleteModal(true);
          }}
        />
      )}

      { /* 계정 탈퇴 완료 모달 띄우기 */}
      {showCompleteModal && (
        <WithdrawCompleteModal onClose={() => setShowCompleteModal(false)} />
      )}
    </>
  );
}
