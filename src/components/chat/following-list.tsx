import { SimpleMemberProfile } from "../../types/chat/chat";

interface FollowingListProps {
  isMobile: boolean;
  users: SimpleMemberProfile[];
  onSelectUser: (user: SimpleMemberProfile) => void;
}

export default function FollowingList({
  users,
  onSelectUser,
}: FollowingListProps) {
  return (
    <div className="flex flex-col h-full">
      <ul className="mt-4">
        {users.map((following) => (
          <li
            key={following.memberId}
            onClick={() => onSelectUser(following)}
            className="flex items-center p-3 border border-gray-300 rounded-lg mb-3 cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <img
              src={following.memberImageUrl}
              alt="프로필"
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <span>{following.memberName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
