// types/project-local.ts
import type { ProjectSummary } from "../api/project-board";

/**
 * ProjectSummary는 백엔드에서 받아온 원본 타입
 * 여기에 프론트에서 필요한 가공 데이터들(참여자 수, 작성자 이름 등)을 추가 정의
 */
export type Project = ProjectSummary & {
  status: "모집중" | "모집완료";
  participants: string; // ex. "3/6"
  title: string;        // projectTitle과 동일 (UI 가공용)
  content: string;      // previewContent 또는 projectDescription
  tags: string[];       // 백엔드에 없는 경우 프론트에서 mock 처리
  author: { name: string }; // 원래 authorName(string) → 구조화
  date: string;         // createdAt을 가공해서 사용
  views: number;        // 조회수 (mock 또는 백엔드 제공)
};
