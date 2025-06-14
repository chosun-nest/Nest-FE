// 회원 정보 전체
export interface MemberProfile {
  memberId: number;
  memberEmail: string;
  memberRole: string;
  memberName: string;
  memberSnsUrl1: string;
  memberSnsUrl2: string;
  memberSnsUrl3: string;
  memberSnsUrl4: string;
  memberIsStudent: boolean;
  memberIntroduce: string;
  memberImageUrl: string;
  memberPasswordLength: number;
  memberDepartmentResponseDtoList: MemberDepartment[];
  memberTechStackResponseDtoList: MemberTechStack[];
}

// 학과 정보
export interface MemberDepartment {
  memberDepartmentId: number;
  memberId: number;
  departmentId: number;
  departmentName: string;
}

// // 관심 분야 정보
// export interface MemberInterest {
//   memberInterestId: number;
//   memberId: number;
//   interestId: number;
//   interestName: string;
// }

// 기술 스택 정보
export interface MemberTechStack {
  memberTechStackId: number;
  memberId: number;
  techStackId: number;
  techStackName: string;
}

// 회원 정보 수정 요청
export interface UpdateMemberProfilePayload {
  memberName?: string;
  memberImageUrl?: string;
  memberIsStudent?: boolean;
  memberIntroduce?: string;
  memberSnsUrl1?: string;
  memberSnsUrl2?: string;
  memberSnsUrl3?: string;
  memberSnsUrl4?: string;
  memberDepartmentUpdateRequestIdList?: number[];
  memberTechStackUpdateRequestIdList?: number[];
}

// 비밀번호 확인 요청
export interface CheckPasswordPayload {
  password: string;
}

// 비밀번호 변경 요청
export interface UpdateMemberPasswordPayload {
  currentPassword?: string;
  newPassword?: string;
  newPasswordConfirm?: string;
}
