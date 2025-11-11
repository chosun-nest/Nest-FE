import { useEffect, useState } from "react";
import RoleToggleBadge from "./RoleToggleBadge";

interface RecruitRoleCardProps {
  defaultRole?: string;
  authorName: string;
  onRoleChange?: (newRole: string) => void;
  onKick?: () => void; // 💡 추가: 삭제 요청 콜백
}

export default function RecruitRoleCard({
  defaultRole = "FRONTEND",
  authorName,
  onRoleChange,
  onKick,
}: RecruitRoleCardProps) {
  const [role, setRole] = useState(defaultRole);

  // 외부 defaultRole 변경이 들어오면 반영
  useEffect(() => {
    setRole(defaultRole);
  }, [defaultRole]);

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <RoleToggleBadge
          role={role}
          setRole={(newRole) => {
            setRole(newRole);
            onRoleChange?.(newRole);
          }}
        />
        <span
          className={`font-medium ${authorName === "모집중" ? "text-gray-500" : ""}`}
        >
          {authorName}
        </span>
      </div>
      {authorName !== "모집중" && (
        <button
          onClick={onKick}
          className="text-red-500 text-sm ml-2 hover:text-red-700"
          title="참여자 거절"
        >
          ✕
        </button>
      )}
    </div>
  );
}
