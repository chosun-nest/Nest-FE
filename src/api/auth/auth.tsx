import { SignupPayload } from "../../types/signup";
import { API } from "../index_c";

export const login = async (email: string, password: string) => {
  const res = await API.post(
    "/api/v1/auth/login",
    { email, password },
    { headers: { skipAuth: true } }
  ); // 첫 번째 인자는 base url에서 파생된 요청할 주소임
  return res.data;
};

export const signup = async (payload: SignupPayload) => {
  const res = await API.post("/api/v1/auth/signup", payload, {
    headers: { skipAuth: true },
  });
  return res.data;
};

export const sendcode = async (email: string) => {
  const res = await API.post(
    "/api/v1/auth/send-code",
    { email },
    { headers: { skipAuth: true } }
  );
  return res.data;
};

export const verifycode = async (email: string, code: string) => {
  const res = await API.post(
    "/api/v1/auth/verify-code",
    { email, code },
    { headers: { skipAuth: true } }
  );
  return res.data;
};
