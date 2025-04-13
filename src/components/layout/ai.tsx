import { useState } from "react";

export default function Ai() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* AI 도우미 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-[50px] h-[50px] bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition duration-300"
        aria-label="AI 도우미 열기"
      >
        🤖
      </button>

      {/* 모달 (아이콘 바로 위에) */}
      {isOpen && (
        <div className="fixed right-6 bottom-[calc(6rem+50px+8px)] w-[300px] h-[500px] bg-white rounded-xl p-4 shadow-xl z-50">
          <h2 className="text-base font-semibold mb-2">AI 도우미</h2>
          <p className="text-sm">무엇을 도와드릴까요?</p>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            aria-label="닫기"
          >
            ✖️
          </button>
        </div>
      )}
    </>
  );
}
