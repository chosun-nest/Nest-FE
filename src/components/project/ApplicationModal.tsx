import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  getApplicationsByProjectId,
  updateApplicationStatus,
} from "../../api/project/ProjectAPI";
import { useParams } from "react-router-dom";
import type { Applicant } from "../../types/api/project-board";

interface Props {
  onClose: () => void;
  onAccept: (user: {
    id: number;
    name: string;
    role: "Frontend" | "Backend" | "PM";
    followers: number;
  }) => void;
}

// 지원서 상태 타입 정의
type Status = "pending" | "accepted" | "rejected";

// API 응답에 상태 필드를 추가해서 로컬 상태로 관리
interface ApplicationWithStatus extends Applicant {
  status: Status;
}

export default function ApplicationModal({ onClose, onAccept }: Props) {
  const { id } = useParams(); // 1. 프로젝트 ID 추출
  const [applications, setApplications] = useState<ApplicationWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. 지원자 목록 API 호출
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!id) return;
        const raw = await getApplicationsByProjectId(Number(id));
        const withStatus: ApplicationWithStatus[] = raw.map((app) => ({
          ...app,
          status: "pending",
        }));
        setApplications(withStatus);
      } catch (err) {
        console.error("지원자 목록 불러오기 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [id]);

  // 3. 수락 버튼 클릭 시 (API 호출 + 상태 변경 + 참여자 반영)
  const handleAccept = async (app: ApplicationWithStatus) => {
    try {
      await updateApplicationStatus(app.applicantId, "accepted");
      setApplications((prev) =>
        prev.map((a) => (a.applicantId === app.applicantId ? { ...a, status: "accepted" } : a))
      );
      onAccept({
        id: app.applicantId,
        name: app.name,
        role: app.role as "Frontend" | "Backend" | "PM",
        followers: 0,
      });
    } catch (err) {
      console.error("수락 처리 실패", err);
      alert("수락 처리 중 오류가 발생했습니다.");
    }
  };

  // 4. 거절 버튼 클릭 시 (API 호출 + 상태 변경)
  const handleReject = async (applicantId: number) => {
    try {
      await updateApplicationStatus(applicantId, "rejected");
      setApplications((prev) =>
        prev.map((app) => (app.applicantId === applicantId ? { ...app, status: "rejected" } : app))
      );
    } catch (err) {
      console.error("거절 처리 실패", err);
      alert("거절 처리 중 오류가 발생했습니다.");
    }
  };

  // 5. 로딩 중 UI
  if (loading) return <div className="p-4">지원자 목록 불러오는 중...</div>;

  // 6. 실제 지원자 목록 렌더링
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md shadow-lg w-[90%] max-w-md p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">지원서 확인</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {applications.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">지원자가 없습니다.</p>
          ) : (
            applications.map((app) => (
              <div
                key={app.applicantId}
                className="border rounded-md p-3 bg-gray-50 shadow-sm"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-blue-600">
                    #{app.role}
                  </span>
                  <span className="text-sm">👤 {app.name}</span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-line mb-2">
                  {app.message}
                </p>
                {app.status === "pending" ? (
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleAccept(app)}
                      className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      수락
                    </button>
                    <button
                      onClick={() => handleReject(app.applicantId)}
                      className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      거절
                    </button>
                  </div>
                ) : (
                  <p
                    className={`text-sm font-semibold mt-2 text-right ${
                      app.status === "accepted"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {app.status === "accepted" ? "✅ 수락됨" : "❌ 거절됨"}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}