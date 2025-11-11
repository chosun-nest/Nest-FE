interface ChatMessage {
  text: string;
  user: string;
  userName: string;
  userImage?: string;
  timestamp?: string;
  read?: boolean;
}

interface ChatBubbleProps {
  message: ChatMessage;
  isMe: boolean;
}

export default function ChatBubble({ message, isMe }: ChatBubbleProps) {
  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className={`mb-3 flex ${isMe ? "justify-end" : "justify-start"} items-end`}
    >
      {!isMe && (
        <img
          src={message.userImage || "/default-profile.png"}
          alt="상대 프로필"
          className="w-8 h-8 rounded-full mr-2 shrink-0"
        />
      )}

      <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
        {!isMe && (
          <span className="text-xs text-gray-500 mb-1">{message.userName}</span>
        )}

        <div
          className={`
            px-4 py-2 text-sm rounded-2xl shadow-sm 
            whitespace-pre-wrap break-words inline-block
            ${isMe ? "bg-[#002f6c] text-white" : "bg-gray-200 text-gray-800"}
          `}
        >
          {message.text}
        </div>

        <div className="text-xs text-gray-400 mt-1 text-right">
          {formattedTime}
          {isMe && message.read && (
            <span className="ml-1 text-blue-400">✓</span>
          )}
        </div>
      </div>

      {isMe && (
        <img
          src={message.userImage || "/default-profile.png"}
          alt="내 프로필"
          className="w-8 h-8 rounded-full ml-2 shrink-0"
        />
      )}
    </div>
  );
}
