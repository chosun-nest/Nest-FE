// =========================================
// [기본 공통 타입들]
// =========================================
export interface PageInfo {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  // deadline?: string;        // 모집 마감일 - 추가 필요
  // projectStartDate?: string; // 프로젝트 시작일 - 추가 필요
  // projectEndDate?: string;   // 프로젝트 종료일 - 추가 필요
}

// ✅ 프로젝트 상세 조회
export interface ProjectMember {
  part: "FRONTEND" | "BACKEND" | "PM" | "DESIGN" | "AI" | "ETC";
  role: "LEADER" | "MEMBER";
  memberId: number | null;
  memberName: string | null;
}

// =========================================
// [프로젝트 목록/요약 관련]
// =========================================

// ✅ 프로젝트 요약 정보
export interface ProjectSummary {
  projectId: number;
  projectTitle: string;
  previewContent: string;
  author: {
    id: number;
    name: string;
  };
  tags: string[];
  // ✅ 추가 필드 (Swagger 기반)
  parts: { [key: string]: number };           // 역할별 인원 구성
  creatorRole: "LEADER" | "MEMBER";           // 생성자 직책
  creatorPart: string;                        // 생성자 역할
  currentNumberOfMembers: number;             // 현재 인원
  maximumNumberOfMembers: number;             // 최대 인원
  viewCount: number;
  createdAt: string;
  updatedAt: string;                          // 수정 시간
  commentCount: number;
  imageUrl: string;
  isRecruiting: boolean;
  // deadline?: string;        // 모집 마감일 표시 - 추가 필요
  // meetingType?: "온라인" | "오프라인" | "혼합"; // 미팅 방식 표시 - 추가 필요
}

export interface ProjectListResponse {
  projects: ProjectSummary[];
  totalCount: number;
  pageInfo: PageInfo;
}

// =========================================
// [프로젝트 상세 관련]
// =========================================

export interface ProjectDetail {
  projectId: number;
  projectTitle: string;
  projectDescription: string;
  tags: string[];
  author: {
    id: number;
    name: string;
  };
  // ✅ 추가 필드 (Swagger 기반)
  parts: { [key: string]: number };           // 역할별 인원 구성
  creatorRole: "LEADER" | "MEMBER";           // 생성자 직책
  creatorPart: string;                        // 생성자 역할
  projectMembers: ProjectMember[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  isRecruiting: boolean;
  currentNumberOfMembers: number;
  maximumNumberOfMembers: number;
  commentCount: number;
  imageUrl: string;
  // deadline?: string;          // 모집 마감일 - 추가 필요
  // projectStartDate?: string;  // 프로젝트 시작일 - 추가 필요
  // projectEndDate?: string;    // 프로젝트 종료일 - 추가 필요
  // meetingType?: "온라인" | "오프라인" | "혼합"; // 미팅 방식 - 추가 필요
  // category?: string;          // 프로젝트 분야 - 추가 필요
}

// =========================================
// [프로젝트 생성/수정 관련]
// =========================================

// ✅ 프로젝트 생성 요청/응답
export interface CreateProjectPayload {
  projectTitle: string;
  projectDescription?: string;
  isRecruiting: boolean;
  tags?: string[];
  parts: {                                    // ✅ partCounts → parts로 변경
    [key: string]: number;
  };
  creatorPart: string;
  creatorRole: string;
  maximumNumberOfMembers: number;
  // deadline?: string;          // 모집 마감일 - 추가 필요
  // projectStartDate?: string;  // 프로젝트 시작일 - 추가 필요
  // projectEndDate?: string;    // 프로젝트 종료일 - 추가 필요
  // meetingType?: "온라인" | "오프라인" | "혼합"; // 미팅 방식 - 추가 필요
  // category?: string;          // 프로젝트 분야 - 추가 필요
}

export interface CreateProjectPostResponse {
  projectId: number;
  message: string;
}

// ✅ 프로젝트 수정
export interface UpdateProjectPayload {
  projectTitle: string;
  projectDescription: string;
  isRecruiting: boolean;
  tags: string[];
  parts?: {                                   // ✅ partCounts → parts로 변경
    [key: string]: number;
  };
  imageUrls?: string[] | null;
  membersToRemove?: number[];                 // ✅ 추방할 멤버 ID 리스트
  // deadline?: string;          // 모집 마감일 - 추가 필요
  // projectStartDate?: string;  // 프로젝트 시작일 - 추가 필요
  // projectEndDate?: string;    // 프로젝트 종료일 - 추가 필요
  // meetingType?: "온라인" | "오프라인" | "혼합"; // 미팅 방식 - 추가 필요
}

// ✅ 프로젝트 삭제
export interface DeleteProjectResponse {
  projectId: number;
  message: string;
}

// =========================================
// [지원/지원자 관리 관련]
// =========================================
// ✅ 지원서 제출 (POST /apply)
export interface ProjectApplyRequest {
  projectId: number;
  part: "FRONTEND" | "BACKEND" | "PM" | "DESIGN" | "AI" | "ETC";
}

export interface ProjectApplyResponse {
  applicationId: number;
  memberId: number;
  memberName: string;
  part: "FRONTEND" | "BACKEND" | "PM" | "DESIGN" | "AI" | "ETC";
  status: "WAITING" | "ACCEPTED" | "REJECTED" | "CANCELED";
  appliedAt: string;
}

// ✅ 지원자 목록 조회 (GET /applications)
export interface Applicant {
  applicationId: number;
  memberId: number;
  memberName: string;
  part: "FRONTEND" | "BACKEND" | "PM" | "DESIGN" | "AI" | "ETC";
  status: "WAITING" | "ACCEPTED" | "REJECTED";
  appliedAt: string;
  message: string;
}

// ✅ 지원자 상태 통일용 타입 (ProjectApplyResponse와 호환)
export interface DraftProject {
  draftId?: number;
  projectTitle?: string;
  projectDescription?: string;
  isRecruiting?: boolean;
  tags?: string[];
  parts?: {
    [key: string]: number;
  };
  creatorPart?: string;
  creatorRole?: string;
  maximumNumberOfMembers?: number;
  savedAt?: string;
}

// ✅ 프로젝트 상태
export type ProjectStatus = "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface UpdateProjectStatusRequest {
  status: ProjectStatus;
}

// ✅ 기술 스택
export interface TechStack {
  id: number;
  name: string;
  category: string;
}