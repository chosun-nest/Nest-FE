interface ChatMessage {
  text: string;
  user: string;
  userName: string;
  userImage?: string;
}

interface ChatBubbleProps {
  message: ChatMessage;
  isMe: boolean;
}

export default function ChatBubble({ message, isMe }: ChatBubbleProps) {
  return (
    <div
      className={`mb-3 flex ${isMe ? "justify-end" : "justify-start"} items-end`}
    >
      {!isMe && (
        <img
          src={message.userImage || "/default-profile.png"}
          alt="상대 프로필"
          className="w-8 h-8 rounded-full mr-2"
        />
      )}

      <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
        {!isMe && (
          <span className="text-xs text-gray-500 mb-1">{message.userName}</span>
        )}
        <span
          className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm break-words whitespace-pre-wrap ${
            isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          {message.text}
        </span>
      </div>

      {isMe && (
        <img
          src={message.userImage || "/default-profile.png"}
          alt="내 프로필"
          className="w-8 h-8 rounded-full ml-2"
        />
      )}
    </div>
  );
}
