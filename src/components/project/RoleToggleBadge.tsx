import { useState, useRef, useEffect } from "react";

interface RoleToggleBadgeProps {
  role: string;
  setRole: (newRole: string) => void;
}

// ✅ 역할 목록
const roles = ["PM", "FRONTEND", "BACKEND", "AI", "DESIGN", "ETC"];

export default function RoleToggleBadge({
  role,
  setRole,
}: RoleToggleBadgeProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (selected: string) => {
    setRole(selected);
    setOpen(false);
  };

  // ✅ 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* 선택된 역할 뱃지와 버튼 */}
      <div className="flex items-center gap-1">
        <span className="px-2 py-1 bg-green-200 text-sm font-medium rounded">
          {role}
        </span>
        <button
          className="text-gray-600 text-xl font-bold"
          onClick={() => setOpen((prev) => !prev)}
        >
          ...
        </button>
      </div>

      {/* 드롭다운 */}
      {open && (
        <div className="absolute z-10 mt-2 w-28 rounded-md bg-white shadow-lg border">
          <ul className="py-1 text-sm text-gray-700">
            {roles.map((r) => (
              <li
                key={r}
                onClick={() => handleSelect(r)}
                className={`px-3 py-1 cursor-pointer hover:bg-gray-100 ${
                  r === role ? "bg-gray-200 font-semibold" : ""
                }`}
              >
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
