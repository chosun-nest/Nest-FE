/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getApplicantsByProjectId, cancelApplication } from "../../api/project/ProjectAPI";
import type {
  ProjectDetail,
  ProjectMember,
  ProjectApplyResponse,
} from "../../types/api/project-board";

interface Props {
  project: ProjectDetail;
  participants: ProjectMember[];
  onOpenApplicantsModal: () => void;
  onOpenApplyModal: () => void;
  currentUserId: number;
  myApplicationStatus: "WAITING" | "ACCEPTED" | "REJECTED" | "CANCELED" | null;
  myApplicationId: number | null;
}

export default function ParticipantCardBox({
  project,
  participants,
  onOpenApplicantsModal,
  onOpenApplyModal,
  currentUserId,
  myApplicationStatus,
  myApplicationId,
}: Props) {
  const navigate = useNavigate();
  const [applicantsByPart, setApplicantsByPart] = useState<Record<string, number>>({});
  const [isCanceling, setIsCanceling] = useState(false);

  const isAuthor = project.author?.id === currentUserId;

  // 현재 인원 수 계산 (실제로 멤버가 할당된 역할 수)
  const actualCurrentMembers = participants.filter(m => m.memberName).length;

  // 최대 인원 수 계산
  // 1. API에서 maximumNumberOfMembers가 제대로 있으면 사용
  // 2. 없으면 parts 객체에서 계산
  // 3. 그것도 없으면 participants 길이 사용 (폴백)
  const actualMaxMembers = project.maximumNumberOfMembers > 0
    ? project.maximumNumberOfMembers
    : project.parts
      ? Object.values(project.parts).reduce((sum, count) => sum + count, 0)
      : participants.length;

  // 모집 마감 조건: 실제 인원이 최대 인원에 도달하거나, isRecruiting이 false
  const isClosed = !project.isRecruiting || actualCurrentMembers >= actualMaxMembers;

  // 디버깅 로그
  console.log("🔍 ParticipantCardBox 디버깅:");
  console.log("  - participants:", participants);
  console.log("  - actualCurrentMembers:", actualCurrentMembers);
  console.log("  - actualMaxMembers:", actualMaxMembers);
  console.log("  - project.maximumNumberOfMembers:", project.maximumNumberOfMembers);
  console.log("  - project.parts:", project.parts);
  console.log("  - project.isRecruiting:", project.isRecruiting);
  console.log("  - isClosed:", isClosed);

  // 역할별 지원자 수 조회
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const applicants = await getApplicantsByProjectId(project.projectId);
        const countByPart: Record<string, number> = {};

        applicants.forEach((applicant: ProjectApplyResponse) => {
          if (applicant.status === "WAITING") {
            countByPart[applicant.part] = (countByPart[applicant.part] || 0) + 1;
          }
        });

        setApplicantsByPart(countByPart);
      } catch (error) {
        console.error("지원자 수 조회 실패:", error);
      }
    };

    fetchApplicants();
  }, [project.projectId]);

  const handleCancelApplication = async () => {
    if (!myApplicationId || isCanceling) return;

    if (!confirm("정말로 지원을 취소하시겠습니까?")) return;

    try {
      setIsCanceling(true);
      await cancelApplication(project.projectId, myApplicationId);
      alert("지원이 취소되었습니다.");
      window.location.reload();
    } catch (error: any) {
      console.error("지원 취소 실패:", error);
      alert("지원 취소 중 오류가 발생했습니다.");
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md shadow-md w-full">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[17px] font-semibold text-gray-800">
          참여인원 현황
        </h2>
        {isAuthor && (
          <button
            onClick={onOpenApplicantsModal}
            className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            지원자 관리
          </button>
        )}
      </div>

      {/* 모집 현황 표시 개선 */}
      <div className="mb-4 p-3 bg-white rounded-lg border-2 border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">모집 현황</span>
          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
            project.isRecruiting
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-gray-100 text-gray-600 border border-gray-300"
          }`}>
            {project.isRecruiting ? "🚀 모집중" : "✅ 모집완료"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-500 h-full transition-all duration-300"
              style={{
                width: actualMaxMembers > 0 ? `${(actualCurrentMembers / actualMaxMembers) * 100}%` : '0%'
              }}
            />
          </div>
          <span className="text-sm font-bold text-blue-600">
            {actualCurrentMembers} / {actualMaxMembers}
          </span>
        </div>
      </div>

      {/* 역할별 참여자 및 지원자 수 */}
      <div className="flex flex-col gap-2">
        {participants.map((member, index) => {
          const isLeader = member.role === "LEADER";
          const partKey = `${member.memberId}-${index}`;
          const applicantCount = applicantsByPart[member.part] || 0;

          return (
            <div
              key={partKey}
              className="flex items-center justify-between p-3 rounded-lg border shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-1 rounded-full text-green-800 bg-green-100 border border-green-300">
                  {member.part}
                </span>
                {/* 지원자 수 표시 */}
                {applicantCount > 0 && !member.memberName && (
                  <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full border border-orange-300">
                    👤 {applicantCount}명 지원
                  </span>
                )}
              </div>

              {member.memberName ? (
                <button
                  onClick={() => navigate(`/profile/${member.memberId}`)}
                  className="text-sm text-blue-700 hover:underline font-medium"
                >
                  {member.memberName}
                  {isLeader ? " 👑" : ""}
                </button>
              ) : (
                <span className="text-sm text-gray-500">모집중</span>
              )}
            </div>
          );
        })}
      </div>

      {/* 내 지원 상태 또는 지원하기 버튼 */}
      {!isAuthor && (
        <div className="mt-4">
          {myApplicationStatus === "WAITING" ? (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-orange-800">⏳ 지원 대기중</p>
                  <p className="text-xs text-orange-600 mt-1">프로젝트 리더의 승인을 기다리고 있습니다.</p>
                </div>
                <button
                  onClick={handleCancelApplication}
                  disabled={isCanceling}
                  className="px-3 py-1.5 text-xs font-medium bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                >
                  {isCanceling ? "취소 중..." : "지원 취소"}
                </button>
              </div>
            </div>
          ) : myApplicationStatus === "ACCEPTED" ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-green-800">✅ 지원 승인됨</p>
              <p className="text-xs text-green-600 mt-1">프로젝트 팀원으로 승인되었습니다!</p>
            </div>
          ) : myApplicationStatus === "REJECTED" ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-semibold text-red-800">❌ 지원 거절됨</p>
              <p className="text-xs text-red-600 mt-1">아쉽게도 이번 지원이 거절되었습니다.</p>
            </div>
          ) : myApplicationStatus === "CANCELED" ? (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm font-semibold text-gray-800">🚫 지원 취소됨</p>
              <p className="text-xs text-gray-600 mt-1">지원을 취소하셨습니다.</p>
            </div>
          ) : project.isRecruiting && !isClosed ? (
            <button
              onClick={onOpenApplyModal}
              className="w-full px-4 py-3 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🚀 프로젝트 지원하기
            </button>
          ) : (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm font-semibold text-gray-600 text-center">모집이 마감되었습니다</p>
            </div>
          )}
        </div>
      )}

      {/* API 미지원: 마감일 표시 (추후 지원 시 활성화) */}
      {/* {project.deadline && (
        <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
          ⏰ 모집 마감: {project.deadline}
        </div>
      )} */}
    </div>
  );

}
