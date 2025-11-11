import { ChatRoomProfile } from "../../types/chat/chat";

interface ChatListProps {
  onSelectUser: (room: ChatRoomProfile) => void;
  isMobile: boolean;
  chatRooms: ChatRoomProfile[];
}

export default function ChatList({ onSelectUser, chatRooms }: ChatListProps) {
  const formatLastActivity = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (diffInHours < 1) return "방금 전";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}시간 전`;
    return date.toLocaleDateString();
  };

  const getRoomIcon = (roomType: string) => {
    switch (roomType) {
      case "dm":
        return "💬";
      case "project":
        return "🚀";
      case "open":
        return "🔥";
      default:
        return "💭";
    }
  };

  const getRoomImage = (room: ChatRoomProfile) => {
    switch (room.roomType) {
      case "open":
        return "/openchat.png";
      case "project":
        return "/project-room.png";
      case "dm":
        return "/assets/images/user.png";
      default:
        return "/default-room.png";
    }
  };

  const handleRoomSelect = (room: ChatRoomProfile) => {
    onSelectUser(room);
  };

  if (!chatRooms || chatRooms.length === 0) {
    return (
      <div className="">
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">💬</div>
          <p>참여 중인 채팅방이 없습니다.</p>
          <p className="text-sm mt-1">팔로잉 목록에서 대화를 시작해보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">
          {chatRooms.length}개의 채팅방
        </span>
      </div>

      <ul className="space-y-3">
        {chatRooms.map((room) => (
          <li
            key={room.roomId}
            onClick={() => handleRoomSelect(room)}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              room.roomId === 1
                ? "border-orange-300 bg-orange-50 hover:bg-orange-100"
                : "border-gray-300 bg-white hover:bg-gray-50"
            }`}
          >
            <div className="relative">
              <img
                src={getRoomImage(room)}
                alt={`${room.roomName} 이미지`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="absolute -top-1 -right-1 text-xs">
                {getRoomIcon(room.roomType as string)}
              </div>
              {room.roomId === 1 && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
              )}
            </div>

            <div className="flex-1 ml-3 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 truncate flex items-center">
                  {room.roomName}
                </h3>
                <span className="text-xs text-gray-500 ml-2">
                  {formatLastActivity(room.lastActivity)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center text-xs text-gray-400 ml-2">
                  <span className="mr-1">👥</span>
                  <span>2</span> {/* memberCount도 없으므로 고정 */}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
