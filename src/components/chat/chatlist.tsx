import { MemberProfile } from "../../api/profile/ProfileAPI";

interface ChatListProps {
  onSelectUser: (user: MemberProfile) => void;
  isMobile: boolean;
}

// 더미 대화 중인 유저 목록
const dummyChatUsers: MemberProfile[] = [
  {
    memberId: 2,
    memberName: "이자바",
    memberImageUrl: "/images/user2.png",
  },
  {
    memberId: 3,
    memberName: "박파이썬",
    memberImageUrl: "/images/user3.png",
  },
];

export default function ChatList({ onSelectUser }: ChatListProps) {
  return (
    <div className="p-5 border border-[#002f6c] rounded-lg shadow-sm">
      <h2 className="font-bold text-xl">대화 중인 채팅방</h2>
      <ul className="mt-4">
        {dummyChatUsers.map((user) => (
          <li
            key={user.memberId}
            onClick={() => onSelectUser(user)}
            className="flex items-center p-3 border border-gray-300 rounded-lg mb-3 cursor-pointer bg-gray-100 hover:bg-gray-200"
          >
            <img
              src={user.memberImageUrl}
              alt={`${user.memberName} 프로필`}
              className="w-10 h-10 rounded-full mr-3"
            />
            <span>{user.memberName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
