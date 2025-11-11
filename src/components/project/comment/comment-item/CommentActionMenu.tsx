
import { DotsThreeVertical } from "phosphor-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../../../../store/slices/modalSlice";
import { selectCurrentUserId } from "../../../../store/slices/userSlice";

interface Props {
  authorId: number;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CommentActionMenu({ authorId, onEdit, onDelete }: Props) {
  const currentUserId = useSelector(selectCurrentUserId);
  const dispatch = useDispatch();
  const isMine = currentUserId === authorId;
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative ml-auto" ref={menuRef}>
      <button onClick={() => setShowMenu(!showMenu)} className="p-1 rounded hover:bg-gray-100">
        <DotsThreeVertical size={20} />
      </button>
      {showMenu && (
        <div className="absolute right-0 z-10 mt-2 bg-white border rounded shadow w-36">
          {isMine ? (
            <>
              <button onClick={() => { onEdit(); setShowMenu(false); }} className="block px-4 py-2 text-sm hover:bg-gray-100">댓글 수정</button>
              <button onClick={() => { onDelete(); setShowMenu(false); }} className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100">댓글 삭제</button>
            </>
          ) : (
            <button
              onClick={() => {
                setShowMenu(false);
                dispatch(
                  showModal({
                    title: "신고 완료",
                    message: "해당 댓글이 신고 처리되었습니다.",
                    type: "info",
                  })
                );
              }}
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              신고하기
            </button>
          )}
        </div>
      )}
    </div>
  );
}
