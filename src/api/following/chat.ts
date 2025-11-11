import { API } from "..";

export const checkMyChatRooms = async () => {
  const res = await API.get("/api/v1/chatting-room/me", {
    headers: { skipAuth: false },
  });
  return res.data;
};

export const createRoom = async (name: string) => {
  const res = await API.post(
    "/api/v1/chatting-room",
    { chattingRoomName: name },
    { headers: { skipAuth: false } }
  );
  return res.data;
};

export const deleteRoom = async (roomId: number) => {
  const res = await API.delete(`/api/v1/chatting-room/${roomId}`, {
    headers: { skipAuth: false },
  });
  return res.data;
};

export const enterRoom = async ({
  roomId,
  memberId,
}: {
  roomId: number;
  memberId: number;
}) => {
  const res = await API.post(
    `/api/v1/chatting-room-member`,
    {
      chattingRoomId: roomId,
      memberId: memberId,
    },
    { headers: { skipAuth: false } }
  );
  return res.data;
};

export const quitRoom = async ({
  roomId,
  memberId,
}: {
  roomId: number;
  memberId: number;
}) => {
  const res = await API.delete(`/api/v1/chatting-room-member`, {
    data: {
      chattingRoomId: roomId,
      memberId: memberId,
    },
    headers: { skipAuth: false },
  });
  return res.data;
};
