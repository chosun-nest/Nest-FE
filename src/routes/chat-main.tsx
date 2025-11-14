/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavbarHeight } from "../context/NavbarHeightContext";
import ChatRoom from "../components/chat/chat-room";
import ChatList from "../components/chat/chat-list";
import FollowingList from "../components/chat/following-list";
import ChatUnderbar from "../components/chat/chat-underbar";
import * as S from "../assets/styles/chat.styles";
import {
  ChatMode,
  SimpleMemberProfile,
  ChatRoomProfile,
} from "../types/chat/chat";
import { checkMyFollowings } from "../api/following/follow";
import { checkMyChatRooms, createRoom, enterRoom } from "../api/following/chat";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../store/slices/userSlice";
import {
  getMemberProfile,
  getMemberProfileById,
} from "../api/profile/ProfileAPI";
import io from "socket.io-client";

const WS_SERVER_URL = import.meta.env.VITE_API_CHAT_URL;
const socket = io(WS_SERVER_URL, { transports: ["websocket"] });

export default function ChatMain() {
  const currentUserId = useSelector(selectCurrentUserId);
  const { navbarHeight } = useNavbarHeight();
  const [mode, setMode] = useState<ChatMode>("following");

  const [_selectedUser, setSelectedUser] = useState<SimpleMemberProfile | null>(
    null
  );
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomProfile | null>(
    null
  );
  const [followings, setFollowings] = useState<SimpleMemberProfile[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoomProfile[]>([]);

  // 🔹 팔로잉 목록
  useEffect(() => {
    const loadFollowings = async () => {
      try {
        const data = await checkMyFollowings();

        const users = data.users as SimpleMemberProfile[];

        const updatedUsers = await Promise.all(
          users.map(async (user) => {
            const profile = await getMemberProfileById(user.memberId);
            return {
              ...user,
              memberImageUrl: profile.memberImageUrl,
            };
          })
        );

        setFollowings(updatedUsers);
      } catch (err) {
        console.error("팔로잉 목록 불러오기 실패:", err);
      }
    };

    loadFollowings();
  }, []);

  // 🔹 나의 채팅방 목록 + 실시간 반영
  useEffect(() => {
    const loadMyRooms = async () => {
      try {
        const myRooms = await checkMyChatRooms();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedRooms: ChatRoomProfile[] = myRooms.map((room: any) => ({
          roomId: room.chattingRoomId,
          roomName: room.chattingRoomName,
          roomImageUrl: "/assets/images/user.png",
          roomType: "dm",
          lastActivity: room.lastChattedAt || room.createdAt,
        }));
        setChatRooms(mappedRooms);
      } catch (err) {
        console.error("내 채팅방 목록 불러오기 실패:", err);
      }
    };

    if (socket && currentUserId) {
      socket.emit("getChatRooms", currentUserId);

      socket.on("chatRoomsList", (rooms: any[]) => {
        const mapped = rooms.map((room: any) => ({
          roomId: room.chattingRoomId,
          roomName: room.chattingRoomName,
          roomImageUrl: "/dm-chat.png",
          roomType: "dm",
          lastActivity: room.lastChattedAt || room.createdAt,
        }));
        setChatRooms(mapped);
      });

      socket.on("newMessage", (data: any) => {
        setChatRooms((prev) =>
          prev
            .map((room) =>
              room.roomId === data.roomId
                ? { ...room, lastActivity: data.timestamp }
                : room
            )
            .sort(
              (a, b) =>
                new Date(b.lastActivity).getTime() -
                new Date(a.lastActivity).getTime()
            )
        );
      });
    }

    loadMyRooms();

    return () => {
      socket.off("chatRoomsList");
      socket.off("newMessage");
    };
  }, [socket, currentUserId]);

  // 🔹 상대 선택 시 채팅방 생성
  const handleSelectUser = async (user: SimpleMemberProfile) => {
    try {
      const myName = await getMemberProfile().then((p) => p.memberName);
      const sortedNames = [user.memberName, myName].sort();
      const roomName = `${sortedNames[0]}-${sortedNames[1]}`;

      setSelectedUser(user);
      setSelectedRoom(null);

      const roomData = await createRoom(roomName);
      const roomId = roomData.chattingRoomId;

      await enterRoom({ roomId, memberId: user.memberId });
      if (currentUserId) {
        await enterRoom({ roomId, memberId: currentUserId });
      }

      setSelectedRoom({
        roomId,
        roomName,
        roomImageUrl: user.memberImageUrl,
        roomType: "dm",
        lastActivity: new Date().toISOString(),
      });

      setMode("chat");
    } catch (err: any) {
      if (err.response?.status === 500) {
        // 이미 방이 있는 경우
        console.warn("이미 존재하는 채팅방입니다. 기존 방 진입 처리.");

        const myName = await getMemberProfile().then((p) => p.memberName);
        const sortedNames = [user.memberName, myName].sort();
        const roomName = `${sortedNames[0]}-${sortedNames[1]}`;

        const existingRoom = chatRooms.find((r) => r.roomName === roomName);
        if (existingRoom) {
          setSelectedRoom(existingRoom);
          setMode("chat");
        }
      } else {
        console.error("채팅방 생성 실패:", err);
        alert("채팅방 생성 실패");
      }
    }
  };

  const handleSelectRoom = (room: ChatRoomProfile) => {
    setSelectedRoom(room);
    setSelectedUser(null);
    setMode("chat");
  };

  const handleBack = () => {
    setSelectedUser(null);
    setSelectedRoom(null);
    setMode("following");
  };

  return (
    <S.Container navbarHeight={navbarHeight + 20}>
      <h2 className="mb-2 pl-4 font-bold text-xl h-[10%] w-[85%] max-w-[800px] min-w-[350px] border border-[#002f6c] shadow-sm rounded-xl mx-auto flex items-center">
        {mode === "following" && "내 팔로잉 목록"}
        {mode === "room" && "채팅방 목록"}
        {mode === "chat" && selectedRoom && `${selectedRoom.roomName}의 채팅방`}
      </h2>

      <div className="flex flex-col flex-1 min-h-0 h-[100%] w-[85%] max-w-[800px] min-w-[350px] bg-white p-5 border border-[#002f6c] overflow-auto shadow-sm rounded-xl ">
        {mode === "following" && (
          <>
            <FollowingList
              isMobile
              onSelectUser={handleSelectUser}
              users={followings}
            />
          </>
        )}

        {mode === "room" && (
          <ChatList
            isMobile
            chatRooms={chatRooms}
            onSelectUser={handleSelectRoom}
          />
        )}

        {mode === "chat" && selectedRoom && (
          <ChatRoom isMobile chatRoom={selectedRoom} onBack={handleBack} />
        )}
      </div>
      <ChatUnderbar onChangeMode={setMode} />
    </S.Container>
  );
}
