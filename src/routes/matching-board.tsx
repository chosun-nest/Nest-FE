// 매칭 서비스 메인 페이지
import { useEffect, useState, useRef } from "react";
import Navbar from "../components/layout/navbar";
import MatchingSearch from "../components/matching/MatchingSearch";
import MatchingSection from "../components/matching/MatchingSection";
import MatchingSectionCard from "../components/matching/MatchingSectionCard";
import {
  getMatchingByInterests,
  getMatchingSameMajor,
  getMatchingPopular,
  getMatchingByTechStack,
  getMatchingNewMembers,
} from "../api/matching/MatchingAPI";
import {
  MatchingMember,
  MatchingMemberByInterest,
  MatchingMemberByTechStack,
  MatchingNewMember,
} from "../types/api/matching";
import {
  mockInterestMembers,
  mockTechStackMembers,
  mockSameMajorMembers,
  mockPopularMembers,
} from "../utils/mockMatchingData";

export default function MatchingBoard() {
  const [navHeight, setNavHeight] = useState(0);
  const navbarRef = useRef<HTMLDivElement>(null);

  // 관심사 기반 매칭 (Mock 데이터 초기값)
  const [interestMembers, setInterestMembers] = useState<MatchingMemberByInterest[]>(mockInterestMembers);
  const [interestLoading, setInterestLoading] = useState(false);
  const [interestError, setInterestError] = useState<string | null>(null);

  // 같은 학과 (Mock 데이터 초기값)
  const [sameMajorMembers, setSameMajorMembers] = useState<MatchingMemberByInterest[]>(mockSameMajorMembers);
  const [sameMajorLoading, setSameMajorLoading] = useState(false);
  const [sameMajorError, setSameMajorError] = useState<string | null>(null);

  // 인기 사용자 (Mock 데이터 초기값)
  const [popularMembers, setPopularMembers] = useState<MatchingMember[]>(mockPopularMembers);
  const [popularLoading, setPopularLoading] = useState(false);
  const [popularError, setPopularError] = useState<string | null>(null);

  // 기술 스택 매칭 (Mock 데이터 초기값)
  const [techStackMembers, setTechStackMembers] = useState<MatchingMemberByTechStack[]>(mockTechStackMembers);
  const [techStackLoading, setTechStackLoading] = useState(false);
  const [techStackError, setTechStackError] = useState<string | null>(null);

  // 신규 회원
  const [newMembers, setNewMembers] = useState<MatchingNewMember[]>([]);
  const [newMembersLoading, setNewMembersLoading] = useState(false);
  const [newMembersError, setNewMembersError] = useState<string | null>(null);

  // 관심사 기반 매칭 조회
  const fetchInterestMatching = async () => {
    try {
      setInterestLoading(true);
      setInterestError(null);
      const response = await getMatchingByInterests(0, 20);
      // Mock 데이터와 실제 데이터 합치기 (중복 제거)
      const combined = [...mockInterestMembers, ...response.members];
      const unique = combined.filter(
        (member, index, self) =>
          index === self.findIndex((m) => m.memberId === member.memberId)
      );
      setInterestMembers(unique);
    } catch (error: any) {
      console.error("관심사 매칭 조회 실패:", error);
      // API 실패해도 Mock 데이터는 유지
      setInterestError(null);
    } finally {
      setInterestLoading(false);
    }
  };

  // 같은 학과 조회
  const fetchSameMajor = async () => {
    try {
      setSameMajorLoading(true);
      setSameMajorError(null);
      const response = await getMatchingSameMajor(0, 20);
      // Mock 데이터와 합치기
      const combined = [...mockSameMajorMembers, ...response.members];
      const unique = combined.filter(
        (member, index, self) =>
          index === self.findIndex((m) => m.memberId === member.memberId)
      );
      setSameMajorMembers(unique);
    } catch (error: any) {
      console.error("같은 학과 조회 실패:", error);
      setSameMajorError(null);
    } finally {
      setSameMajorLoading(false);
    }
  };

  // 인기 사용자 조회
  const fetchPopular = async () => {
    try {
      setPopularLoading(true);
      setPopularError(null);
      const response = await getMatchingPopular(20);
      // Mock 데이터와 합치기
      const combined = [...mockPopularMembers, ...response.members];
      const unique = combined.filter(
        (member, index, self) =>
          index === self.findIndex((m) => m.memberId === member.memberId)
      );
      setPopularMembers(unique);
    } catch (error: any) {
      console.error("인기 사용자 조회 실패:", error);
      setPopularError(null);
    } finally {
      setPopularLoading(false);
    }
  };

  // 기술 스택 매칭 조회
  const fetchTechStackMatching = async () => {
    try {
      setTechStackLoading(true);
      setTechStackError(null);
      const response = await getMatchingByTechStack(0, 20);
      // Mock 데이터와 합치기
      const combined = [...mockTechStackMembers, ...response.members];
      const unique = combined.filter(
        (member, index, self) =>
          index === self.findIndex((m) => m.memberId === member.memberId)
      );
      setTechStackMembers(unique);
    } catch (error: any) {
      console.error("기술 스택 매칭 조회 실패:", error);
      setTechStackError(null);
    } finally {
      setTechStackLoading(false);
    }
  };

  // 신규 회원 조회
  const fetchNewMembers = async () => {
    try {
      setNewMembersLoading(true);
      setNewMembersError(null);
      const response = await getMatchingNewMembers(7, 0, 20);
      setNewMembers(response.members);
    } catch (error: any) {
      console.error("신규 회원 조회 실패:", error);
      setNewMembersError(error?.response?.data?.message || "데이터를 불러올 수 없습니다.");
    } finally {
      setNewMembersLoading(false);
    }
  };

  // 네비게이션 바 높이 계산
  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    // Phase 1: 필수 기능 (백엔드 우선 구현)
    fetchInterestMatching();
    fetchSameMajor();
    fetchPopular();

    // Phase 2: 추가 기능 (선택적)
    fetchTechStackMatching();
    fetchNewMembers();
  }, []);

  return (
    <>
      <Navbar ref={navbarRef} />
      <div
        className="min-h-screen bg-gray-50"
        style={{ paddingTop: navHeight + 20 }}
      >
        <div className="container max-w-7xl px-4 py-4 mx-auto sm:py-6 md:py-8">
          {/* 페이지 헤더 */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#002F6C] mb-2">
              🤝 매칭 서비스
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              나와 맞는 동료들을 찾아보세요
            </p>
          </div>

          {/* 검색 영역 */}
          <MatchingSearch />

          {/* 그리드 레이아웃 (데스크톱) */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-4 xl:gap-6 mb-8" style={{ gridAutoRows: '500px' }}>
            {/* 왼쪽 상단 - 관심사 기반 매칭 */}
            <div className="lg:col-span-1 lg:row-span-1">
              <MatchingSectionCard
                title="나와 관심사가 비슷한 사람들"
                icon="💙"
                members={interestMembers}
                isLoading={interestLoading}
                error={interestError}
                variant="medium"
                maxDisplay={6}
                sectionType="interest"
              />
            </div>

            {/* 중앙 상단 - 기술 스택 매칭 */}
            <div className="lg:col-span-1 lg:row-span-1">
              <MatchingSectionCard
                title="기술 스택이 맞는 개발자"
                icon="💻"
                members={techStackMembers}
                isLoading={techStackLoading}
                error={techStackError}
                variant="medium"
                maxDisplay={6}
                sectionType="techStack"
              />
            </div>

            {/* 오른쪽 - 인기 사용자 (높이 2칸 차지) */}
            <div className="lg:row-span-2 xl:row-span-2">
              <MatchingSectionCard
                title="인기 있는 사용자"
                icon="⭐"
                members={popularMembers}
                isLoading={popularLoading}
                error={popularError}
                variant="tall"
                maxDisplay={12}
                sectionType="popular"
              />
            </div>

            {/* 왼쪽 하단 - 같은 학과 */}
            <div className="lg:col-span-1 lg:row-span-1">
              <MatchingSectionCard
                title="같은 학과의 동료들"
                icon="🎓"
                members={sameMajorMembers}
                isLoading={sameMajorLoading}
                error={sameMajorError}
                variant="medium"
                maxDisplay={6}
                sectionType="sameMajor"
              />
            </div>

            {/* 중앙 하단 - 신규 회원 */}
            <div className="lg:col-span-1 lg:row-span-1">
              <MatchingSectionCard
                title="새로 들어온 친구들"
                icon="✨"
                members={newMembers}
                isLoading={newMembersLoading}
                error={newMembersError}
                variant="medium"
                maxDisplay={6}
                sectionType="newMembers"
              />
            </div>
          </div>

          {/* 모바일/태블릿 레이아웃 (세로 나열) */}
          <div className="lg:hidden space-y-6 sm:space-y-8">
            {/* 1. 관심사 기반 매칭 */}
            <MatchingSection
              title="나와 관심사가 비슷한 사람들"
              icon="💙"
              members={interestMembers}
              isLoading={interestLoading}
              error={interestError}
              showMatchInfo={true}
            />

            {/* 2. 같은 학과 */}
            <MatchingSection
              title="같은 학과의 동료들"
              icon="🎓"
              members={sameMajorMembers}
              isLoading={sameMajorLoading}
              error={sameMajorError}
              showMatchInfo={true}
            />

            {/* 3. 기술 스택 매칭 */}
            <MatchingSection
              title="기술 스택이 맞는 개발자"
              icon="💻"
              members={techStackMembers}
              isLoading={techStackLoading}
              error={techStackError}
              showMatchInfo={true}
            />

            {/* 4. 인기 사용자 */}
            <MatchingSection
              title="인기 있는 사용자"
              icon="⭐"
              members={popularMembers}
              isLoading={popularLoading}
              error={popularError}
              showMatchInfo={false}
            />

            {/* 5. 신규 회원 */}
            <MatchingSection
              title="새로 들어온 친구들"
              icon="✨"
              members={newMembers}
              isLoading={newMembersLoading}
              error={newMembersError}
              showMatchInfo={true}
            />
          </div>

        </div>
      </div>
    </>
  );
}
