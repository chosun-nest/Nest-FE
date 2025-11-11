import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  getApplicantsByProjectId,
  updateApplicationStatus,
} from "../../api/project/ProjectAPI";
import { useParams } from "react-router-dom";
import type { ProjectApplyResponse } from "../../types/api/project-board";

interface Props {
  onClose: () => void;
  onAccept: (user: {
    id: number;
    name: string;
    role: "FRONTEND" | "BACKEND" | "PM" | "DESIGN" | "AI" | "ETC";
    followers: number;
  }) => void;
}

type Status = "WAITING" | "ACCEPTED" | "REJECTED" | "CANCELED";

interface ApplicationWithStatus extends ProjectApplyResponse {
  memberName: string;
  status: Status;
  message2: string;
}

export default function ApplicationModal({ onClose, onAccept }: Props) {
  const { id } = useParams();
  const [applications, setApplications] = useState<ApplicationWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!id) return;
        const raw = await getApplicantsByProjectId(Number(id));
        const enriched: ApplicationWithStatus[] = raw.map((app) => ({
          ...app,
          status: app.status,
          message2: "", // 기본값 할당 또는 필요시 다른 값으로 대체
        }));
        setApplications(enriched);
      } catch (err) {
        console.error("지원자 목록 불러오기 실패", err);
        alert("지원자 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [id]);

  const handleAccept = async (app: ApplicationWithStatus) => {
    try {
      if (!id) throw new Error("Project ID is undefined");
      await updateApplicationStatus(Number(id), app.applicationId, "accept");
      setApplications((prev) =>
        prev.map((a) =>
          a.applicationId === app.applicationId
            ? { ...a, status: "ACCEPTED" }
            : a
        )
      );
      onAccept({
        id: app.memberId,
        name: app.memberName,
        role: app.part,
        followers: 0,
      });
    } catch (err) {
      console.error("수락 처리 실패", err);
      alert("수락 처리 중 오류가 발생했습니다.");
    }
  };

  const handleReject = async (applicationId: number) => {
    try {
      await updateApplicationStatus(Number(id), applicationId, "reject");
      setApplications((prev) =>
        prev.filter((app) => app.applicationId !== applicationId)
      );
    } catch (err) {
      console.error("거절 처리 실패", err);
      alert("거절 처리 중 오류가 발생했습니다.");
    }
  };

  const visibleApplicants = applications.filter(
    (app) => app.status !== "REJECTED" && app.status !== "CANCELED"
  );

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md shadow-lg w-[90%] max-w-md p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="p-4">지원자 목록 불러오는 중...</div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">지원서 확인</h2>
              <button onClick={onClose}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {visibleApplicants.length === 0 ? (
                <p className="text-sm text-gray-500 text-center">
                  지원자가 없습니다.
                </p>
              ) : (
                visibleApplicants.map((app) => (
                  <div
                    key={app.applicationId}
                    className="border rounded-md p-3 bg-gray-50 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-blue-600">
                        #{app.part}
                      </span>
                      <span className="text-sm">👤 {app.memberName}</span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-line mb-2">
                      {app.message2 || "(메시지 없음)"}
                    </p>
                    {app.status === "WAITING" ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleAccept(app)}
                          className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          수락
                        </button>
                        <button
                          onClick={() => handleReject(app.applicationId)}
                          className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          거절
                        </button>
                      </div>
                    ) : (
                      <p
                        className={`text-sm font-semibold mt-2 text-right ${
                          app.status === "ACCEPTED"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        ✅ 수락됨
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
