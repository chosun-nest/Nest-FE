import { getProjects } from "../api/project/ProjectAPI";
import type { ProjectSummary } from "../types/api/project-board";

interface Params {
  size?: number;
}

// 클라이언트용 확장 타입 (status 문자열 포함)
export interface ProjectWithStatus extends ProjectSummary {
  status: "모집중" | "모집완료";
}

/**
 * 모든 프로젝트를 최신순으로 size개 가져오기 (필터 없음, 모집 상태 포함)
 */
export const getTopProjects = async ({
  size = 5,
}: Params): Promise<ProjectWithStatus[]> => {
  try {
    const res = await getProjects({
      "pageable.page": 0,
      "pageable.size": size,
      "pageable.sort": "createdAt,desc",
    });

    const result: ProjectWithStatus[] = res.projects
      .slice(0, size)
      .map((project) => ({
        ...project,
        status: project.isRecruiting ? "모집중" : "모집완료",
      }));

    return result;
  } catch (error) {
    console.error("❌ getTopProjects 실패:", error);
    return [];
  }
};
