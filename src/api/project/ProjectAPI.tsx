import { API } from "..";
import {
  CreateProjectPayload,
  CreateProjectPostResponse,
  ProjectListResponse,
  ProjectDetail,
  UpdateProjectPayload,
  DeleteProjectResponse,
  ProjectApplyRequest,
  ProjectApplyResponse,
  DraftProject,
  ProjectStatus,
  UpdateProjectStatusRequest,
  TechStack,
} from "../../types/api/project-board";

// =========================================
// [프로젝트 모집 등록용 - project-write.tsx]
// =========================================

// 프로젝트 모집글 생성 (POST) - 인증 필요
export const createProjectPost = async (
  payload: CreateProjectPayload
): Promise<CreateProjectPostResponse> => {
  const response = await API.post("/api/v1/projects/new", payload);
  return response.data;
};

// 프로젝트 임시저장 (초안 저장) -> 추가 예정
export const saveDraftProject = async (
  payload: Partial<CreateProjectPayload>
): Promise<DraftProject> => {
  const response = await API.post("/api/v1/projects/draft", payload);
  return response.data;
};

// 임시저장된 프로젝트 목록 조회 -> 추가 예정
export const getDraftProjects = async (): Promise<DraftProject[]> => {
  const response = await API.get("/api/v1/projects/drafts");
  return response.data;
};

// 임시저장된 프로젝트 불러오기 -> 추가 예정
export const getDraftProject = async (draftId: number): Promise<DraftProject> => {
  const response = await API.get(`/api/v1/projects/drafts/${draftId}`);
  return response.data;
};

// 임시저장 삭제 -> 추가 예정
export const deleteDraftProject = async (draftId: number): Promise<void> => {
  await API.delete(`/api/v1/projects/drafts/${draftId}`);
};

// =========================================
// [프로젝트 게시판용 - project-board.tsx]
// =========================================

// 프로젝트 목록 조회 (쿼리 파라미터: page, size, sort, tags) (GET) - 인증 불필요
export const getProjects = async (params: {
  page: number;
  size: number;
  sort: string;
  tags?: string[];
}): Promise<ProjectListResponse> => {
  const queryParams = new URLSearchParams();

  if (params.page !== undefined)
    queryParams.append("page", String(params.page));
  if (params.size !== undefined)
    queryParams.append("size", String(params.size));
  if (params.sort) queryParams.append("sort", params.sort);
  if (params.tags?.length) {
    params.tags.forEach((tag) => queryParams.append("tags", tag));
  }

  const response = await API.get<ProjectListResponse>(
    `/api/v1/projects?${queryParams.toString()}`,
    {
      headers: { skipAuth: true },
    }
  );

  return response.data;
};

// 게시글 검색(GET) - 인증 불필요
export const searchProjects = async (params: {
  keyword: string;
  searchType?: "ALL" | "TITLE" | "CONTENT" | "AUTHOR";
  tags?: string[];
  page: number;
  size: number;
  sort: string;
}): Promise<ProjectListResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("keyword", params.keyword);
  if (params.searchType) queryParams.append("searchType", params.searchType);
  queryParams.append("page", String(params.page));
  queryParams.append("size", String(params.size));
  queryParams.append("sort", params.sort);

  if (params.tags?.length) {
    params.tags.forEach((tag) => queryParams.append("tags", tag));
  }

  const response = await API.get<ProjectListResponse>(
    `/api/v1/projects/search?${queryParams.toString()}`,
    {
      headers: { skipAuth: true },
    }
  );

  return response.data;
};

// =========================================
// [프로젝트 모집 게시글 상세용 - project-detail.tsx]
// =========================================

// 프로젝트 상세 조회 (GET) - 인증 불필요
export const getProjectById = async (
  projectId: number
): Promise<ProjectDetail> => {
  const response = await API.get(`/api/v1/projects/${projectId}`);
  return response.data;
};

// 프로젝트 삭제 (DELETE) - 인증 필요
export const deleteProject = async (
  projectId: number
): Promise<DeleteProjectResponse> => {
  const response = await API.delete(`/api/v1/projects/${projectId}`);
  return response.data;
};

// 프로젝트 수정 (PATCH) - 인증 필요
export const updateProject = async (
  projectId: number,
  payload: UpdateProjectPayload
): Promise<void> => {
  await API.patch(`/api/v1/projects/${projectId}`, payload);
};

// 프로젝트 상태 변경 (진행중/완료/취소) -> 추가 예정
export const updateProjectStatus = async (
  projectId: number,
  status: ProjectStatus
): Promise<void> => {
  const payload: UpdateProjectStatusRequest = { status };
  await API.patch(`/api/v1/projects/${projectId}/status`, payload);
};

// =========================================
// [지원/지원자 관리용]
// =========================================

// ✅ 프로젝트 모집글에 지원
export const applyToProject = async (
  payload: ProjectApplyRequest
): Promise<ProjectApplyResponse> => {
  const response = await API.post(
    `/api/v1/projects/${payload.projectId}/apply`,
    { part: payload.part },
    {
      headers: { skipAuth: false },
    }
  );
  return response.data;
};

// ✅ [이름 변경] 지원자 목록 조회
export const getApplicantsByProjectId = async (
  projectId: number
): Promise<ProjectApplyResponse[]> => {
  const response = await API.get(`/api/v1/projects/${projectId}/applications`, {
    headers: { skipAuth: false },
  });
  return response.data;
};

// ✅ 지원서 상태 변경 (수락 / 거절)
export const updateApplicationStatus = async (
  projectId: number,
  applicationId: number,
  status: "accept" | "reject"
): Promise<void> => {
  await API.post(
    `/api/v1/projects/${projectId}/applications/${applicationId}/${status}`,
    {},
    { headers: { skipAuth: false } }
  );
};

// ✅ 지원 취소 (POST 방식으로 변경)
export const cancelApplication = async (
  projectId: number,
  applicationId: number
): Promise<void> => {
  await API.post(
    `/api/v1/projects/${projectId}/applications/${applicationId}/cancel`,
    {},
    { headers: { skipAuth: false } }
  );
};

// ✅ 내 지원서 목록 조회 (새로 추가)
export const getMyApplications = async (): Promise<ProjectApplyResponse[]> => {
  const response = await API.get("/api/v1/projects/applications/me", {
    headers: { skipAuth: false },
  });
  return response.data;
};

// =========================================
// [공통/기타]
// =========================================

// ✅ 프로젝트 참여 역할 목록 조회 (새로 추가)
export const getProjectPartEnums = async (): Promise<string[]> => {
  const response = await API.get("/api/v1/projects/members", {
    headers: { skipAuth: true },
  });
  return response.data;
};

// 기술 스택 목록 조회 (GET)
export const getTechStacks = async (): Promise<TechStack[]> => {
  const res = await API.get("/api/v1/tech-stacks", {
    headers: { skipAuth: true },
  });
  return res.data;
};

// ✅ getTech의 신규 이름 (기존 호환성 유지)
export const getTech = async (): Promise<TechStack[]> => {
  return getTechStacks();
};

// 프로젝트 신고 -> 추가 예정
export const reportProject = async (
  projectId: number,
  reason: string,
  description?: string
): Promise<void> => {
  await API.post(`/api/v1/projects/${projectId}/report`, {
    reason,
    description,
  });
};