/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { applyToProject } from "../../api/project/ProjectAPI";
import type {
  ProjectDetail,
  ProjectMember,
  ProjectApplyRequest,
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

  const isAuthor = project.author?.id === currentUserId;
  const isClosed =
    project.currentNumberOfMembers >= project.maximumNumberOfMembers;

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

      <div className="flex flex-col gap-2">
        {participants.map((member, index) => {
          const isLeader = member.role === "LEADER";
          const partKey = `${member.memberId}-${index}`;

          return (
            <div
              key={partKey}
              className="flex items-center justify-between p-2 rounded border shadow-sm bg-white"
            >
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-green-800 bg-green-100 border border-green-300">
                {member.part}
              </span>

              {member.memberName ? (
                <button
                  onClick={() => navigate(`/profile/${member.memberId}`)}
                  className="text-sm text-blue-700 hover:underline"
                >
                  {member.memberName}
                  {isLeader ? " (리더)" : ""}
                </button>
              ) : isAuthor || isLeader ? (
                <span className="text-sm text-gray-500">모집중</span>
              ) : myApplicationStatus === "ACCEPTED" ? (
                <span className="text-sm text-green-600 font-semibold">
                  수락됨
                </span>
              ) : myApplicationStatus === "WAITING" ? (
                <span className="text-sm text-orange-500">지원중</span>
              ) : (
                <button
                  onClick={() => handleApply(member.part)}
                  disabled={isClosed || applyingPart === member.part}
                  className={`text-sm px-2 py-1 rounded ${
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

      <div className="text-sm text-gray-600 text-right mt-3">
        참여 {project.currentNumberOfMembers} / {project.maximumNumberOfMembers}
      </div>
    </div>
  );
}
