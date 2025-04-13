// 팀장님꺼니 건들지 마라
import API from "../index";

export const getTech = async () => {
  const res = API.get("/api/v1/tech-stacks");
  return (await res).data;
};

export const getInterests = async () => {
  const res = API.get("/api/v1/interests");
  return (await res).data;
};

export const getDepartments = async () => {
  const res = API.get("/api/v1/departments");
  return (await res).data;
};
