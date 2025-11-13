/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { applyToProject, getApplicantsByProjectId } from "../../api/project/ProjectAPI";
import type {
  ProjectDetail,
  ProjectMember,
  ProjectApplyRequest,
  ProjectApplyResponse,
} from "../../types/api/project-board";

interface Props {
  project: ProjectDetail;
  participants: ProjectMember[];
  onOpenModal: () => void;
  currentUserId: number;
  myApplicationStatus: "WAITING" | "ACCEPTED" | "REJECTED" | "CANCELED" | null;
}

export default function ParticipantCardBox({
  project,
  participants,
  onOpenModal,
  currentUserId,
  myApplicationStatus,
}: Props) {
  const navigate = useNavigate();
  const [applyingPart, setApplyingPart] = useState<string | null>(null);
  const [applicantsByPart, setApplicantsByPart] = useState<Record<string, number>>({});

  const isAuthor = project.author?.id === currentUserId;
  const isClosed =
    project.currentNumberOfMembers >= project.maximumNumberOfMembers;

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

  const handleApply = async (part: ProjectApplyRequest["part"]) => {
    if (applyingPart) return;
    setApplyingPart(part);
    try {
      const payload: ProjectApplyRequest = {
        projectId: project.projectId,
        part,
      };
      await applyToProject(payload);
      alert("지원이 완료되었습니다.");
      window.location.reload(); // or trigger a refresh callback
    } catch (error: any) {
      if (
        error?.response?.status === 400 &&
        typeof error.response.data === "string" &&
        error.response.data.includes("이미 해당 파트에 지원")
      ) {
        alert("이미 해당 프로젝트에에 지원한 상태입니다.");
      } else {
        console.error("지원 실패:", error);
        alert("지원 중 오류가 발생했습니다.");
      }
    } finally {
      setApplyingPart(null);
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
            onClick={onOpenModal}
            className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            지원서 확인
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
                width: `${(project.currentNumberOfMembers / project.maximumNumberOfMembers) * 100}%`
              }}
            />
          </div>
          <span className="text-sm font-bold text-blue-600">
            {project.currentNumberOfMembers} / {project.maximumNumberOfMembers}
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
              ) : isAuthor || isLeader ? (
                <span className="text-sm text-gray-500">모집중</span>
              ) : myApplicationStatus === "ACCEPTED" ? (
                <span className="text-sm text-green-600 font-semibold">
                  ✅ 수락됨
                </span>
              ) : myApplicationStatus === "WAITING" ? (
                <span className="text-sm text-orange-500 font-semibold">⏳ 지원중</span>
              ) : (
                <button
                  onClick={() => handleApply(member.part)}
                  disabled={isClosed || applyingPart === member.part}
                  className={`text-sm px-3 py-1.5 rounded-md font-medium transition-colors ${
                    isClosed || applyingPart === member.part
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isClosed
                    ? "모집 완료"
                    : applyingPart === member.part
                      ? "지원 중..."
                      : "지원하기"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* API 미지원: 마감일 표시 (추후 지원 시 활성화) */}
      {/* {project.deadline && (
        <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
          ⏰ 모집 마감: {project.deadline}
        </div>
      )} */}
    </div>
  ); 

}
