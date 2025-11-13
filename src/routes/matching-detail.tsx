// 매칭 서비스 섹션별 전체 목록 페이지
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/navbar";
import MatchingUserCard from "../components/matching/MatchingUserCard";
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

type SectionType = "interest" | "techStack" | "sameMajor" | "popular" | "newMembers";

interface SectionConfig {
  title: string;
  icon: string;
  fetchFunction: () => Promise<any>;
  mockData?: any[];
}

export default function MatchingDetail() {
  const { sectionType } = useParams<{ sectionType: SectionType }>();
  const navigate = useNavigate();
  const [navHeight, setNavHeight] = useState(0);
  const navbarRef = useRef<HTMLDivElement>(null);

  const [members, setMembers] = useState<
    | MatchingMember[]
    | MatchingMemberByInterest[]
    | MatchingMemberByTechStack[]
    | MatchingNewMember[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 섹션별 설정
  const sectionConfigs: Record<SectionType, SectionConfig> = {
    interest: {
      title: "나와 관심사가 비슷한 사람들",
      icon: "💙",
      fetchFunction: async () => {
        const response = await getMatchingByInterests(0, 100);
        const combined = [...mockInterestMembers, ...response.members];
        const unique = combined.filter(
          (member, index, self) =>
            index === self.findIndex((m) => m.memberId === member.memberId)
        );
        return unique;
      },
      mockData: mockInterestMembers,
    },
    techStack: {
      title: "기술 스택이 맞는 개발자",
      icon: "💻",
      fetchFunction: async () => {
        const response = await getMatchingByTechStack(0, 100);
        const combined = [...mockTechStackMembers, ...response.members];
        const unique = combined.filter(
          (member, index, self) =>
            index === self.findIndex((m) => m.memberId === member.memberId)
        );
        return unique;
      },
      mockData: mockTechStackMembers,
    },
    sameMajor: {
      title: "같은 학과의 동료들",
      icon: "🎓",
      fetchFunction: async () => {
        const response = await getMatchingSameMajor(0, 100);
        const combined = [...mockSameMajorMembers, ...response.members];
        const unique = combined.filter(
          (member, index, self) =>
            index === self.findIndex((m) => m.memberId === member.memberId)
        );
        return unique;
      },
      mockData: mockSameMajorMembers,
    },
    popular: {
      title: "인기 있는 사용자",
      icon: "⭐",
      fetchFunction: async () => {
        const response = await getMatchingPopular(100);
        const combined = [...mockPopularMembers, ...response.members];
        const unique = combined.filter(
          (member, index, self) =>
            index === self.findIndex((m) => m.memberId === member.memberId)
        );
        return unique;
      },
      mockData: mockPopularMembers,
    },
    newMembers: {
      title: "새로 들어온 친구들",
      icon: "✨",
      fetchFunction: async () => {
        const response = await getMatchingNewMembers(7, 0, 100);
        return response.members;
      },
    },
  };

  const currentSection = sectionType ? sectionConfigs[sectionType] : null;

  // 네비게이션 바 높이 계산
  useEffect(() => {
    if (navbarRef.current) {
      setNavHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  // 데이터 로드
  useEffect(() => {
    const fetchMembers = async () => {
      if (!currentSection) {
        navigate("/lecture-board");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await currentSection.fetchFunction();
        setMembers(data);
      } catch (error: any) {
        console.error("데이터 로드 실패:", error);
        // 에러 발생 시 Mock 데이터 사용
        if (currentSection.mockData) {
          setMembers(currentSection.mockData);
          setError(null);
        } else {
          setError(error?.response?.data?.message || "데이터를 불러올 수 없습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [sectionType]);

  if (!currentSection) {
    return null;
  }

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
            <button
              onClick={() => navigate("/lecture-board")}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#002F6C] mb-4 transition-colors"
            >
              ← 돌아가기
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#002F6C] mb-2 flex items-center gap-3">
              <span className="text-3xl sm:text-4xl">{currentSection.icon}</span>
              {currentSection.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              총 {members.length}명의 사용자
            </p>
          </div>

          {/* 로딩 상태 */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-[#002F6C] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">불러오는 중...</p>
              </div>
            </div>
          )}

          {/* 에러 상태 */}
          {error && !isLoading && (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">⚠️ {error}</p>
            </div>
          )}

          {/* 데이터 없음 */}
          {!isLoading && !error && members.length === 0 && (
            <div className="p-12 text-center bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">추천할 사용자가 없습니다.</p>
            </div>
          )}

          {/* 사용자 목록 */}
          {!isLoading && !error && members.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {members.map((member) => (
                <MatchingUserCard
                  key={member.memberId}
                  member={member}
                  showMatchInfo={sectionType !== "popular"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
