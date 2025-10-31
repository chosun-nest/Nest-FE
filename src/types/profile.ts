// 프론트엔드용 - 프로필 컴포넌트 타입 정의
export interface Item {
  id: number;
  name: string;
}

export interface DepartmentResponse {
  departmentId: number;
  departmentName: string;
}

export interface TechStackResponse {
  techStackId: number;
  techStackName: string;
}

export interface InterestResponse {
  interestId: number;
  interestName: string;
}

export interface ProfileType {
  memberId: number;
  name: string;
  email: string;
  major: string;
  introduce: string;
  interests: string[];
  sns: string[];
  image: string;
  uploadedImagePath?: string;
  techStacks: string[];
}

export interface ProfileFormData {
  name: string;
  email: string;
  major: string;
  introduce: string;
  sns: string[];
  image: string;
  uploadedImagePath: string;
  techStacks: string[];
  interests: string[];
}

export interface ProfileCardProps {
  profile: ProfileType;
  isOwnProfile: boolean;
  //targetUserId: number; // 다른 사용자 id 가져옴.
}
