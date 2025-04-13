import React, { useState } from "react";

export default function WithdrawModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-3">둥지를 떠난다니 아쉽네요.</h3>
        <p className="text-sm text-red-500 mb-4">회원탈퇴 전 안내사항을 읽어보세요:</p>
        <ul className="list-disc pl-5 text-sm text-gray-700 mb-4 space-y-1">
          <li>회원 탈퇴 시, 더 이상 해당 계정으로 WantIT-Nest 사용이 불가능합니다.</li>
          <li>
            직접 작성한 콘텐츠(사진, 게시물, 댓글 등)는 자동으로 삭제되지 않으며,
            삭제를 원하시면 탈퇴 이전에 삭제해 주세요.
          </li>
        </ul>

        <div className="mb-4">
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              className="mr-2"
            />
            안내사항을 모두 확인했습니다.
          </label>
        </div>

        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 mr-2 border rounded"
          >
            닫기
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded text-white ${
              agreed ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!agreed}
          >
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
}
