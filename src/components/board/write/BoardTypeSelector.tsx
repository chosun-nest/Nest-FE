// 게시판 선택 드롭다운
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type BoardType = "interests" | "projects";

interface Props {
  boardType: BoardType;
}

const boardTypeMap: Record<BoardType, string> = {
  interests: "관심분야 정보 게시글 쓰기",
  projects: "프로젝트 모집 게시글 쓰기",
};

export default function BoardTypeSelector({ boardType }: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleOutsideClick = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSelect = (value: BoardType) => {
    setOpen(false);
    if (value === boardType) return; // 현재 페이지와 같으면 무시
    navigate(value === "interests" ? "/interests-write" : "/project-write");
  };

  return (
    <div className="relative inline-block mb-4" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-2xl font-bold text-[#002F6C] flex items-center gap-2"
      >
        {boardTypeMap[boardType]}
        <span className="text-sm">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg w-60">
          <ul className="text-sm">
            {Object.entries(boardTypeMap).map(([key, label]) => (
              <li
                key={key}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  key === boardType ? "bg-blue-100 font-semibold text-blue-700" : ""
                }`}
                onClick={() => handleSelect(key as BoardType)}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
