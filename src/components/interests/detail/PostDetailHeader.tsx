// 제목, 설정 버튼(작성자, 다른 사용자)
// PostDetailHeader.tsx
import { DotsThreeVertical } from "phosphor-react";
import { useState } from "react";

interface PostDetailHeaderProps {
  isAuthor: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function PostDetailHeader({
  isAuthor,
  onEdit,
  onDelete,
}: PostDetailHeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative shrink-0">
      <button
        className="p-2 text-gray-500 rounded hover:bg-gray-100"
        onClick={() => setShowMenu(!showMenu)}
      >
        <DotsThreeVertical size={22} weight="bold" />
      </button>

      {showMenu && (
      <div className="absolute right-0 z-20 mt-2 bg-white border border-gray-200 rounded shadow-md w-36">
        {isAuthor ? (
          <>
            <button
              onClick={onEdit}
              className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
            >
              게시글 수정
            </button>
            <button
              onClick={onDelete}
              className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
            >
              게시글 삭제
            </button>
          </>
        ) : (
          <button
            className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
          >
            신고하기
          </button>
        )}
      </div>
    )}
    </div>
  );
}
