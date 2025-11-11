import { API } from "..";

export const getUsersAllHistory = async () => {
  const res = await API.get("/api/v1/histories", {
    headers: { skipAuth: false },
  });
  return res.data;
};

export const postAHistory = async (payload: {
  content: string;
  startDate: string;
  endDate: string;
  important: boolean;
}) => {
  const res = await API.post("/api/v1/histories", payload, {
    headers: { skipAuth: false },
  });
  return res.data;
};

export const deleteHistory = async (historyId: number) => {
  const res = await API.delete(`/api/v1/histories/${historyId}`, {
    headers: { skipAuth: false },
  });
  return res.data;
};

export const updateHistory = async (
  historyId: number,
  payload: {
    content?: string;
    startDate?: string;
    endDate?: string;
    important: boolean;
  }
) => {
  const res = await API.put(`/api/v1/histories/${historyId}`, payload, {
    headers: { skipAuth: false },
  });
  return res.data;
};

export const getOthersAllHistory = async (memberId: number) => {
  const res = await API.get(`/api/v1/members/${memberId}/histories`, {
    headers: { skipAuth: false },
  });
  return res.data;
};
