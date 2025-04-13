# 📌 2025-04-13 수정 내용

## ✅ 1. `src/api/index.tsx`
- `baseURL` 변경  
  → 로컬 개발 환경에서는 외부 주소 대신 **localhost** 사용

## ✅ 2. `src/routes/notice-board.tsx`
- 전체 코드 수정

## ✅ 3. `App.tsx`
- `/notice-board` 관련 코드 수정:

```tsx
import NoticeBoard from "./routes/notice-board"; // yu-geum

...

{
  path: "notice-board/",
  element: <NoticeBoard />,
}

      
