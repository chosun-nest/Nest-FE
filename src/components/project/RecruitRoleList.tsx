import { useState, useEffect } from "react";
import RecruitRoleCard from "./RecruitRoleCard";

interface RecruitCardData {
  id: number; // 로컬 UI에서 식별용
  role: string;
  authorName: string;
  memberId?: number;
}

interface RecruitRoleListProps {
  onChange: (cards: RecruitCardData[]) => void;
  authorName: string;
  onKickMember?: (memberId: number) => void;

  defaultMembers?: { memberId: number; memberName: string; part: string }[];
}

export default function RecruitRoleList({
  onChange,
  authorName,
  defaultMembers,
  onKickMember,
}: RecruitRoleListProps) {
  const [cards, setCards] = useState<RecruitCardData[]>([]);
  const handleKick = (id: number) => {
    const target = cards.find((c) => c.id === id);
    if (target?.memberId && onKickMember) {
      onKickMember(target.memberId); // ✅ 부모에게 알림
    }
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  // 🔒 무한 루프 방지를 위한 초기화 로직
  useEffect(() => {
    setCards((prev) => {
      if (prev.length > 0) return prev; // 이미 초기화되어 있으면 무시
      if (defaultMembers && defaultMembers.length > 0) {
        return defaultMembers.map((member, idx) => ({
          id: idx + 1,
          role: member.part.toUpperCase(),
          authorName: member.memberName,
          memberId: member.memberId,
        }));
      } else {
        return [
          {
            id: 1,
            role: "FRONTEND",
            authorName,
          },
        ];
      }
    });
  }, []); // ✅ 최초 1회만 실행

  useEffect(() => {
    onChange(cards);
  }, [cards, onChange]);

  const handleAddCard = () => {
    const newId = cards.length > 0 ? cards[cards.length - 1].id + 1 : 1;
    const newCard: RecruitCardData = {
      id: newId,
      role: "FRONTEND",
      authorName: "모집중",
    };
    setCards((prev) => [...prev, newCard]);
  };

  const handleChangeRole = (id: number, newRole: string) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, role: newRole.toUpperCase() } : card
      )
    );
  };

  return (
    <div className="bg-blue-50 p-4 rounded-md w-full md:w-[300px]">
      <h3 className="text-md font-semibold mb-2">모집 분야</h3>

      <div className="space-y-3 mb-4">
        {cards.map((card) => (
          <RecruitRoleCard
            key={card.id}
            defaultRole={card.role}
            authorName={card.authorName}
            onRoleChange={(role) => handleChangeRole(card.id, role)}
            onKick={() => handleKick(card.id)}
          />
        ))}
      </div>

      <button
        onClick={handleAddCard}
        className="w-full text-2xl text-center py-1 border rounded-full bg-white hover:bg-gray-100"
      >
        ＋
      </button>
    </div>
  );
}
