// 매칭 서비스 전용 API 타입 정의
// 다른 API 타입과 구분되도록 Matching 접두사 사용

// 매칭된 회원 기본 정보
export interface MatchingMember {
  memberId: number;
  memberName: string;
  memberEmail: string;
  memberImageUrl: string;
  memberIntroduce: string;
  memberDepartmentResponseDtoList: {
    departmentId: number;
    departmentName: string;
  }[];
  memberInterestResponseDtoList: {
    interestId: number;
    interestName: string;
  }[];
  memberTechStackResponseDtoList: {
    techStackId: number;
    techStackName: string;
  }[];
  followerCount?: number;
}

// 관심사 기반 매칭 회원 (공통 관심사 정보 포함)
export interface MatchingMemberByInterest extends MatchingMember {
  matchCount: number; // 겹치는 관심사 개수
  commonInterests: string[]; // 공통 관심사 목록
}

// 기술 스택 기반 매칭 회원 (공통 기술 스택 정보 포함)
export interface MatchingMemberByTechStack extends MatchingMember {
  stackMatchCount: number; // 겹치는 기술 스택 개수
  commonStacks: string[]; // 공통 기술 스택 목록
}

// 신규 가입 회원 (가입일 정보 포함)
export interface MatchingNewMember extends MatchingMember {
  joinedDate: string; // ISO 날짜 형식
}

// 페이지네이션 기본 응답
interface MatchingPaginationResponse {
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

// 검색 응답
export interface MatchingSearchResponse extends MatchingPaginationResponse {
  members: MatchingMember[];
}

// 관심사 기반 매칭 응답
export interface MatchingByInterestResponse extends MatchingPaginationResponse {
  members: MatchingMemberByInterest[];
}

// 같은 학과 매칭 응답
export interface MatchingSameMajorResponse extends MatchingPaginationResponse {
  members: MatchingMemberByInterest[];
}

// 기술 스택 매칭 응답
export interface MatchingByTechStackResponse extends MatchingPaginationResponse {
  members: MatchingMemberByTechStack[];
}

// 인기 사용자 응답 (페이지네이션 없음)
export interface MatchingPopularResponse {
  members: MatchingMember[];
}

// 신규 회원 응답
export interface MatchingNewMembersResponse extends MatchingPaginationResponse {
  members: MatchingNewMember[];
}

// 검색 타입
export type MatchingSearchType = "name" | "major" | "tag";
