// convertToProfileType 프로필 정보 항목 타입들 정의

import type { ProfileType } from "../types/profile";
import type { MemberProfile } from "../types/api/profile";  // 특정 회원 정보 조회

export function convertToProfileType(
  member: MemberProfile,
  interests?: string[]
): ProfileType {
  return {
    memberId: member.memberId,
    image: member.memberImageUrl,
    name: member.memberName,
    email: member.memberEmail,
    major: member.memberDepartmentResponseDtoList[0]?.departmentName || "",
    introduce: member.memberIntroduce || "",
    // interests를 매개변수로 받으면 사용, 아니면 빈 배열
    interests: interests || [],
    techStacks: member.memberTechStackResponseDtoList.map((t) => t.techStackName),
    sns: [
      member.memberSnsUrl1,
      member.memberSnsUrl2,
      member.memberSnsUrl3,
      member.memberSnsUrl4,
    ].filter(Boolean),
  };
}

