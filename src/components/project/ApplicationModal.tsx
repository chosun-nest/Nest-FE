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
        prev.map((a) =>
          a.applicationId === applicationId
            ? { ...a, status: "REJECTED" }
            : a
        )
      );
    } catch (err) {
      console.error("거절 처리 실패", err);
      alert("거절 처리 중 오류가 발생했습니다.");
    }
  };

  // 모든 지원자 표시 (거절/취소 포함)
  const visibleApplicants = applications;

  // 상태별 배지 스타일
  const getStatusBadge = (status: Status) => {
    switch (status) {
      case "WAITING":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300">⏳ 대기중</span>;
      case "ACCEPTED":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-300">✅ 수락됨</span>;
      case "REJECTED":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-300">❌ 거절됨</span>;
      case "CANCELED":
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-300">🚫 취소됨</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">-</span>;
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex justify-between items-center p-5 border-b bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">지원자 관리</h2>
            <p className="text-sm text-gray-600 mt-1">총 {visibleApplicants.length}명의 지원자</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">지원자 목록 불러오는 중...</p>
              </div>
            </div>
          ) : visibleApplicants.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <div className="text-center text-gray-500">
                <p className="text-lg mb-2">📭</p>
                <p>아직 지원자가 없습니다.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">이름</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">역할</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">상태</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">지원일</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleApplicants.map((app, index) => (
                    <tr
                      key={app.applicationId}
                      className={`border-b hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      {/* 이름 */}
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">
                        👤 {app.memberName}
                      </td>

                      {/* 역할 */}
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                          {app.part}
                        </span>
                      </td>

                      {/* 상태 */}
                      <td className="px-4 py-3">
                        {getStatusBadge(app.status)}
                      </td>

                      {/* 지원일 */}
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(app.appliedAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>

                      {/* 액션 버튼 */}
                      <td className="px-4 py-3">
                        {app.status === "WAITING" ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleAccept(app)}
                              className="px-3 py-1.5 text-xs font-medium bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                            >
                              ✓ 수락
                            </button>
                            <button
                              onClick={() => handleReject(app.applicationId)}
                              className="px-3 py-1.5 text-xs font-medium bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                              ✕ 거절
                            </button>
                          </div>
                        ) : (
                          <div className="text-center text-sm text-gray-400">
                            -
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="border-t p-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
