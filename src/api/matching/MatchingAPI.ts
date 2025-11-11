// 매칭 서비스 전용 API
// 백엔드 연결 시 엔드포인트만 수정하면 바로 동작

import { API } from "..";
import { getAccessToken } from "../../utils/auth";
import {
  MatchingSearchResponse,
  MatchingByInterestResponse,
  MatchingSameMajorResponse,
  MatchingByTechStackResponse,
  MatchingPopularResponse,
  MatchingNewMembersResponse,
  MatchingSearchType,
} from "../../types/api/matching";

// 공통 인증 헤더
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getAccessToken()}`,
  },
});

/**
 * 1. 사용자 검색
 * @param keyword 검색 키워드
 * @param type 검색 타입 (name, major, studentId)
 * @param page 페이지 번호 (0부터 시작)
 * @param size 페이지 크기
 */
export const searchMatchingMembers = async (
  keyword: string,
  type: MatchingSearchType = "name",
  page: number = 0,
  size: number = 20
): Promise<MatchingSearchResponse> => {
  const res = await API.get("/api/v1/matching/search", {
    ...authHeader(),
    params: { keyword, type, page, size },
  });
  return res.data;
};

/**
 * 2. 관심사 기반 매칭
 * 내 관심 태그와 1개 이상 겹치는 사람 추천
 * @param page 페이지 번호
 * @param size 페이지 크기
 */
export const getMatchingByInterests = async (
  page: number = 0,
  size: number = 20
): Promise<MatchingByInterestResponse> => {
  const res = await API.get("/api/v1/matching/by-interests", {
    ...authHeader(),
    params: { page, size },
  });
  return res.data;
};

/**
 * 3. 같은 학과 친구 추천
 * 나와 같은 전공 + 관심 태그 1개 이상 겹치는 사람
 * @param page 페이지 번호
 * @param size 페이지 크기
 */
export const getMatchingSameMajor = async (
  page: number = 0,
  size: number = 20
): Promise<MatchingSameMajorResponse> => {
  const res = await API.get("/api/v1/matching/same-major", {
    ...authHeader(),
    params: { page, size },
  });
  return res.data;
};

/**
 * 4. 인기 사용자 추천
 * 팔로워 수가 많은 상위 사용자
 * @param limit 조회할 사용자 수
 */
export const getMatchingPopular = async (
  limit: number = 20
): Promise<MatchingPopularResponse> => {
  const res = await API.get("/api/v1/matching/popular", {
    ...authHeader(),
    params: { limit },
  });
  return res.data;
};

/**
 * 5. 기술 스택 기반 매칭
 * 나의 기술 스택과 1개 이상 겹치는 사람
 * @param page 페이지 번호
 * @param size 페이지 크기
 */
export const getMatchingByTechStack = async (
  page: number = 0,
  size: number = 20
): Promise<MatchingByTechStackResponse> => {
  const res = await API.get("/api/v1/matching/by-tech-stack", {
    ...authHeader(),
    params: { page, size },
  });
  return res.data;
};

/**
 * 6. 신규 회원 조회
 * 최근 N일 이내 가입자
 * @param days 며칠 이내 가입자 (기본 7일)
 * @param page 페이지 번호
 * @param size 페이지 크기
 */
export const getMatchingNewMembers = async (
  days: number = 7,
  page: number = 0,
  size: number = 20
): Promise<MatchingNewMembersResponse> => {
  const res = await API.get("/api/v1/matching/new-members", {
    ...authHeader(),
    params: { days, page, size },
  });
  return res.data;
};
