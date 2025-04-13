import { useNavigate } from "react-router-dom";

export default function WithdrawCompleteModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();

  const handleConfirm = () => {
    onClose();            // 모달 닫기
    navigate("/");        // 홈페이지(루트)로 이동
  };

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
        <h3 className="text-lg font-bold text-gray-800 mb-4">탈퇴되었습니다</h3>
        <p className="text-sm text-gray-600 mb-6">이용해주셔서 감사합니다.</p>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          확인
        </button>
      </div>
    </div>
  );
}
