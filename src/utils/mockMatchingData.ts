// 매칭 서비스 Mock 데이터
import {
  MatchingMemberByInterest,
  MatchingMemberByTechStack,
  MatchingMember,
} from "../types/api/matching";

// 관심사 기반 매칭 Mock 데이터
export const mockInterestMembers: MatchingMemberByInterest[] = [
  {
    memberId: 101,
    memberName: "김민준",
    memberEmail: "minjun@chosun.ac.kr",
    memberImageUrl: "/assets/images/user.png",
    memberIntroduce: "웹 개발에 관심이 많은 학생입니다. React와 Node.js를 공부하고 있어요!",
    memberDepartmentResponseDtoList: [
      { departmentId: 1, departmentName: "컴퓨터공학과" },
    ],
    memberInterestResponseDtoList: [
      { interestId: 1, interestName: "웹 개발" },
      { interestId: 2, interestName: "React" },
      { interestId: 3, interestName: "프론트엔드" },
    ],
    memberTechStackResponseDtoList: [
      { techStackId: 1, techStackName: "React" },
      { techStackId: 2, techStackName: "TypeScript" },
      { techStackId: 3, techStackName: "Tailwind CSS" },
    ],
    followerCount: 15,
    matchCount: 3,
    commonInterests: ["웹 개발", "React", "프론트엔드"],
  },
  {
    memberId: 102,
    memberName: "이서연",
    memberEmail: "seoyeon@chosun.ac.kr",
    memberImageUrl: "/assets/images/user.png",
    memberIntroduce: "UI/UX 디자인과 프론트엔드 개발을 함께 공부하고 있습니다.",
    memberDepartmentResponseDtoList: [
      { departmentId: 2, departmentName: "소프트웨어학과" },
    ],
    memberInterestResponseDtoList: [
      { interestId: 1, interestName: "웹 개발" },
      { interestId: 4, interestName: "UI/UX" },
    ],
    memberTechStackResponseDtoList: [
      { techStackId: 1, techStackName: "React" },
      { techStackId: 4, techStackName: "Figma" },
    ],
    followerCount: 22,
    matchCount: 2,
    commonInterests: ["웹 개발", "프론트엔드"],
  },
];

// 기술 스택 매칭 Mock 데이터
export const mockTechStackMembers: MatchingMemberByTechStack[] = [
  {
    memberId: 201,
    memberName: "박지훈",
    memberEmail: "jihoon@chosun.ac.kr",
    memberImageUrl: "/assets/images/user.png",
    memberIntroduce: "풀스택 개발자를 꿈꾸는 학생입니다. 백엔드와 프론트엔드 모두 관심있어요.",
    memberDepartmentResponseDtoList: [
      { departmentId: 1, departmentName: "컴퓨터공학과" },
    ],
    memberInterestResponseDtoList: [
      { interestId: 5, interestName: "백엔드" },
      { interestId: 6, interestName: "데이터베이스" },
    ],
    memberTechStackResponseDtoList: [
      { techStackId: 5, techStackName: "Spring Boot" },
      { techStackId: 6, techStackName: "MySQL" },
      { techStackId: 1, techStackName: "React" },
    ],
    followerCount: 18,
    stackMatchCount: 2,
    commonStacks: ["React", "TypeScript"],
  },
  {
    memberId: 202,
    memberName: "최예은",
    memberEmail: "yeeun@chosun.ac.kr",
    memberImageUrl: "/assets/images/user.png",
    memberIntroduce: "모바일 앱 개발에 관심이 많습니다. Flutter와 React Native를 공부중이에요!",
    memberDepartmentResponseDtoList: [
      { departmentId: 2, departmentName: "소프트웨어학과" },
    ],
    memberInterestResponseDtoList: [
      { interestId: 7, interestName: "모바일" },
      { interestId: 8, interestName: "앱 개발" },
    ],
    memberTechStackResponseDtoList: [
      { techStackId: 7, techStackName: "Flutter" },
      { techStackId: 2, techStackName: "TypeScript" },
    ],
    followerCount: 12,
    stackMatchCount: 1,
    commonStacks: ["TypeScript"],
  },
];

// 같은 학과 Mock 데이터
export const mockSameMajorMembers: MatchingMemberByInterest[] = [
  {
    memberId: 301,
    memberName: "정우진",
    memberEmail: "woojin@chosun.ac.kr",
    memberImageUrl: "/assets/images/user.png",
    memberIntroduce: "알고리즘과 자료구조에 관심이 많아요. 같이 코딩테스트 스터디 하실 분!",
    memberDepartmentResponseDtoList: [
      { departmentId: 1, departmentName: "컴퓨터공학과" },
    ],
    memberInterestResponseDtoList: [
      { interestId: 9, interestName: "알고리즘" },
      { interestId: 10, interestName: "자료구조" },
    ],
    memberTechStackResponseDtoList: [
      { techStackId: 8, techStackName: "Python" },
      { techStackId: 9, techStackName: "C++" },
    ],
    followerCount: 25,
    matchCount: 1,
    commonInterests: ["알고리즘"],
  },
  {
    memberId: 302,
    memberName: "강지민",
    memberEmail: "jimin@chosun.ac.kr",
    memberImageUrl: "/assets/images/user.png",
    memberIntroduce: "AI와 머신러닝을 공부하고 있습니다. 딥러닝 프로젝트에 참여하고 싶어요.",
    memberDepartmentResponseDtoList: [
      { departmentId: 1, departmentName: "컴퓨터공학과" },
    ],
    memberInterestResponseDtoList: [
      { interestId: 11, interestName: "인공지능" },
      { interestId: 12, interestName: "머신러닝" },
    ],
    memberTechStackResponseDtoList: [
      { techStackId: 8, techStackName: "Python" },
      { techStackId: 10, techStackName: "TensorFlow" },
    ],
    followerCount: 30,
    matchCount: 1,
    commonInterests: ["인공지능"],
  },
];

// 인기 사용자 Mock 데이터
export const mockPopularMembers: MatchingMember[] = [
  {
    memberId: 401,
    memberName: "윤서준",
    memberEmail: "seojun@chosun.ac.kr",
    memberImageUrl: "/assets/images/user.png",
    memberIntroduce: "오픈소스 컨트리뷰터이자 웹 개발자입니다. 다양한 프로젝트에 참여하고 있어요!",
    memberDepartmentResponseDtoList: [
      { departmentId: 1, departmentName: "컴퓨터공학과" },
    ],
    memberInterestResponseDtoList: [
      { interestId: 1, interestName: "웹 개발" },
      { interestId: 13, interestName: "오픈소스" },
    ],
    memberTechStackResponseDtoList: [
      { techStackId: 1, techStackName: "React" },
      { techStackId: 11, techStackName: "Vue.js" },
      { techStackId: 12, techStackName: "Node.js" },
    ],
    followerCount: 150,
  },
  {
    memberId: 402,
    memberName: "한소희",
    memberEmail: "sohee@chosun.ac.kr",
    memberImageUrl: "/assets/images/user.png",
    memberIntroduce: "스타트업 인턴 경험이 있는 개발자입니다. 다양한 기술 스택을 다뤄봤어요.",
    memberDepartmentResponseDtoList: [
      { departmentId: 2, departmentName: "소프트웨어학과" },
    ],
    memberInterestResponseDtoList: [
      { interestId: 14, interestName: "스타트업" },
      { interestId: 5, interestName: "백엔드" },
    ],
    memberTechStackResponseDtoList: [
      { techStackId: 5, techStackName: "Spring Boot" },
      { techStackId: 13, techStackName: "Docker" },
      { techStackId: 14, techStackName: "AWS" },
    ],
    followerCount: 120,
  },
];
