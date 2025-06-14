/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        nestblue: "#002f6c", // NEST 전용 페이지네이션 색상
      },
      animation: {
        "modal-in": "scaleIn 0.4s cubic-bezier(0.25,1,0.5,1) forwards",
      },
      keyframes: {
        scaleIn: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),   // 게시글 detail 페이지 마크다운 형식으로 보여지도록 하기 위해 추가함. // 설치 : npm install @tailwindcss/typography 
  ],
};
