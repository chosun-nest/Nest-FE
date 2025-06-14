// src/components/chat/FriendList.tsx
import { MemberProfile } from "../../api/profile/ProfileAPI";

interface FriendListProps {
  isMobile: boolean;
  onSelectUser: (user: MemberProfile) => void;
}

const dummyFriends: MemberProfile[] = [
  {
    memberId: 1,
    memberName: "김코딩",
    memberImageUrl: "/images/user1.png",
  },
  {
    memberId: 2,
    memberName: "이자바",
    memberImageUrl: "/images/user2.png",
  },
];

export default function FriendList({ onSelectUser }: FriendListProps) {
  return (
    <div className="p-5 border border-[#002f6c] rounded-lg shadow-sm">
      <h2 className="font-bold text-xl">내 친구 목록</h2>
      <ul className="mt-4">
        {dummyFriends.map((friend) => (
          <li
            key={friend.memberId}
            onClick={() => onSelectUser(friend)}
            className="flex items-center p-3 border border-gray-300 rounded-lg mb-3 cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <img
              src={friend.memberImageUrl}
              alt="프로필"
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <span>{friend.memberName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
