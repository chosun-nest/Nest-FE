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
} from "../../types/api/project-board";

// ✅ 프로젝트 게시글 생성
export const createProjectPost = async (
  payload: CreateProjectPayload
): Promise<CreateProjectPostResponse> => {
  const response = await API.post("/api/v1/projects/new", payload);
  return response.data;
};

// ✅ 프로젝트 목록 조회 (쿼리 파라미터: page, size, sort, tags)
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

// ✅ 프로젝트 검색
export const searchProjects = async (params: {
  keyword: string;
  searchType?: "ALL" | "TITLE" | "CONTENT";
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

// ✅ 프로젝트 상세 조회
export const getProjectById = async (
  projectId: number
): Promise<ProjectDetail> => {
  const response = await API.get(`/api/v1/projects/${projectId}`);
  return response.data;
};

// ✅ 프로젝트 수정
export const updateProject = async (
  projectId: number,
  payload: UpdateProjectPayload
): Promise<void> => {
  await API.patch(`/api/v1/projects/${projectId}`, payload);
};

// ✅ 프로젝트 삭제
export const deleteProject = async (
  projectId: number
): Promise<DeleteProjectResponse> => {
  const response = await API.delete(`/api/v1/projects/${projectId}`);
  return response.data;
};

// ✅ 프로젝트 모집글에 지원
export const applyToProject = async (payload: ProjectApplyRequest) => {
  const response = await API.post(
    `/api/v1/projects/${payload.projectId}/apply`,
    { part: payload.part },
    {
      headers: { skipAuth: false },
    }
  );
  return response.data;
};

// ✅ [이름 변경] 지원자 목록 조회 (Swagger 구조에 맞춤)
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
    { headers: { skipAuth: false } }
  );
};
