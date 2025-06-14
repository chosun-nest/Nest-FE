import { useState, useEffect, useRef, useCallback } from "react";
import { getMemberProfile } from "../../api/profile/ProfileAPI";
import { MemberProfile } from "../../types/api/profile";
import ChatBubble from "./chatbubble";

interface ChatMessage {
  text: string;
  user: string;
  userName: string;
  userImage?: string;
}

interface ChatRoomProps {
  isMobile: boolean;
  user: MemberProfile; // 대화 상대 정보
  onBack: () => void;
}

const WS_SERVER_URL = import.meta.env.VITE_API_CHAT_URL.replace(
  /^http:/,
  "ws:"
);

const FIXED_ROOM_NAME = "chat_1";

const safeJsonStringify = (data: unknown): string => {
  try {
    return JSON.stringify(data);
  } catch (e) {
    console.error("JSON.stringify 오류:", e, data);
    return "";
  }
};

export default function ChatRoom({ isMobile, user, onBack }: ChatRoomProps) {
  const [currentUser, setCurrentUser] = useState<MemberProfile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const profile = await getMemberProfile();
      setCurrentUser(profile);
    } catch (error) {
      console.error("내 프로필 가져오기 실패:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (!currentUser) return;

    // 기존 연결 종료
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    const ws = new WebSocket(WS_SERVER_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        safeJsonStringify({
          type: "joinRoom",
          payload: {
            roomName: FIXED_ROOM_NAME,
            userId: String(currentUser.memberId), // 식별자 명시
          },
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === "message") {
          setMessages((prev) => [...prev, parsed.payload]);
        }
      } catch (e) {
        console.error("메시지 파싱 오류:", e, event.data);
      }
    };

    return () => {
      ws.close();
      setMessages([]);
    };
  }, [currentUser]);

  const handleSend = () => {
    const text = inputMessage.trim();
    if (!text || !currentUser || wsRef.current?.readyState !== WebSocket.OPEN)
      return;

    const message: ChatMessage = {
      text,
      user: String(currentUser.memberId),
      userName: currentUser.memberName,
      userImage: currentUser.profileImageUrl || "",
    };

    wsRef.current.send(
      safeJsonStringify({
        type: "chatMessage",
        payload: message,
      })
    );

    setInputMessage("");
  };

  if (!currentUser) {
    return <div className="p-5 text-sm text-gray-500">로딩 중...</div>;
  }

  return (
    <div
      className={`flex flex-col ${
        isMobile
          ? "h-full"
          : "h-[600px] max-w-xl mx-auto border border-gray-200 rounded-xl shadow-md overflow-hidden"
      }`}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-100">
        <button
          onClick={onBack}
          className="text-xl font-bold text-gray-500 hover:text-black"
        >
          ←
        </button>
        <div className="flex-1 text-center font-semibold">
          {user.memberName}
        </div>
        <div className="w-6" />
      </div>

      {/* 메시지 리스트 */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {messages.map((msg, index) => {
          const isMe = msg.user === String(currentUser.memberId);
          return <ChatBubble key={index} message={msg} isMe={isMe} />;
        })}
      </div>

      {/* 입력 */}
      <div className="flex items-center gap-2 px-4 py-3 border-t bg-gray-50">
        <input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="메시지를 입력하세요"
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          disabled={!inputMessage.trim()}
          className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg disabled:opacity-50"
        >
          전송
        </button>
      </div>
    </div>
  );
}
