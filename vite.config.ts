import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 챗봇 API는 포트 8000으로
      "/api/chat": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
      // 나머지 API는 Spring 백엔드(포트 6030)로
      "/api": {
        target: "http://localhost:6030",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
