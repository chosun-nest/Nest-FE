import { SignupPayload } from "../../types/signup";
import API from "../index";

export const login = async (email: string, password: string) => {
  const res = await API.post("/api/v1/auth/login", { email, password }); // 첫 번째 인자는 base url에서 파생된 요청할 주소임
  return res.data;
};

export const signup = async (payload: SignupPayload) => {
  const res = await API.post("/api/v1/auth/signup", payload);
  return res.data;
};

export const sendcode = async (email: string) => {
  const res = await API.post("/api/v1/auth/send-code", { email });
  return res.data;
};

export const verifycode = async (email: string, code: string) => {
  const res = await API.post("/api/v1/auth/verify-code", { email, code });
  return res.data;
};
