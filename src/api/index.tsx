import axios from "axios";

const API = axios.create({
  // baseURL: "http://119.219.30.209:6030/", // 🔴 외부 IP 주소
  // withCredentials: false,
  baseURL: 'http://localhost:6030', // ✅ 로컬 개발 환경에서는 반드시 localhost 사용
  withCredentials: true,
});

export default API;
