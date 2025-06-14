import { useState } from "react";
import { useNavbarHeight } from "../context/NavbarHeightContext";
import FriendList from "../components/chat/friendlist";
import ChatRoom from "../components/chat/chatroom";
import ChatList from "../components/chat/chatlist";
import * as S from "../assets/styles/chat.styles";
import { MemberProfile } from "../types/api/profile";

export default function ChatMain() {
  const { navbarHeight } = useNavbarHeight();
  const [mode, setMode] = useState<"friend" | "chat" | "room">("friend");
  const [selectedUser, setSelectedUser] = useState<MemberProfile | null>(null);

  return (
    <S.Container navbarHeight={navbarHeight + 20}>
      {mode === "friend" && (
        <FriendList
          isMobile={true}
          onSelectUser={(user) => {
            setSelectedUser(user);
            setMode("chat");
          }}
        />
      )}
      {mode === "chat" && selectedUser && (
        <ChatRoom
          isMobile={true}
          user={selectedUser}
          onBack={() => {
            setSelectedUser(null);
            setMode("friend");
          }}
        />
      )}
      {mode === "room" && (
        <ChatList
          isMobile={true}
          onSelectUser={(user) => {
            setSelectedUser(user);
            setMode("chat");
          }}
        />
      )}

      <S.Underbar style={{ flexDirection: "row" }}>
        <S.UnderbarItem onClick={() => setMode("friend")}>
          <svg viewBox="0 0 24 24">
            <path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
          </svg>
          친구
        </S.UnderbarItem>

        <S.UnderbarItem onClick={() => setMode("room")}>
          <svg
            data-slot="icon"
            fill="none"
            strokeWidth="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
            />
          </svg>
          채팅방
        </S.UnderbarItem>

        <S.UnderbarItem onClick={() => alert("더보기 준비 중")}>
          <svg viewBox="0 0 24 24">
            <path d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          더보기
        </S.UnderbarItem>
      </S.Underbar>
    </S.Container>
  );
}
