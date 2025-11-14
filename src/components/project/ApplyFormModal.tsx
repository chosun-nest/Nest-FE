// 일반 사용자용 프로젝트 지원 모달
import { useState } from "react";
import { X } from "lucide-react";
import { applyToProject } from "../../api/project/ProjectAPI";
import type { ProjectApplyRequest } from "../../types/api/project-board";

interface Props {
  projectId: number;
  projectTitle: string;
  availableParts: string[];
  onClose: () => void;
  onSuccess: () => void;
}

type PartType = "FRONTEND" | "BACKEND" | "PM" | "DESIGN" | "AI" | "ETC";

export default function ApplyFormModal({
  projectId,
  projectTitle,
  availableParts,
  onClose,
  onSuccess,
}: Props) {
  const [selectedPart, setSelectedPart] = useState<PartType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const partOptions: { label: string; value: PartType }[] = [
    { label: "프론트엔드", value: "FRONTEND" },
    { label: "백엔드", value: "BACKEND" },
    { label: "PM", value: "PM" },
    { label: "디자인", value: "DESIGN" },
    { label: "AI", value: "AI" },
    { label: "기타", value: "ETC" },
  ];

  // 모집중인 파트만 필터링
  const filteredParts = partOptions.filter((opt) =>
    availableParts.includes(opt.value)
  );

  const handleSubmit = async () => {
    if (!selectedPart) {
      alert("지원할 역할을 선택해주세요!");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: ProjectApplyRequest = {
        projectId,
        part: selectedPart,
      };
      await applyToProject(payload);
      alert("지원이 완료되었습니다!");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("지원 실패:", error);
      if (
        error?.response?.status === 400 &&
        typeof error.response.data === "string" &&
        error.response.data.includes("이미 해당 파트에 지원")
      ) {
        alert("이미 해당 프로젝트에 지원한 상태입니다.");
      } else {
        alert("지원 중 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex justify-between items-center p-5 border-b bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">프로젝트 지원하기</h2>
            <p className="text-sm text-gray-600 mt-1">{projectTitle}</p>
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
          <h3 className="text-base font-semibold mb-3 text-gray-800">
            ✅ 지원할 역할을 선택해 주세요
          </h3>

          {filteredParts.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">현재 모집중인 역할이 없습니다.</p>
          ) : (
            <div className="flex flex-wrap gap-2 mb-6">
              {filteredParts.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setSelectedPart(value)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-150 ${
                    selectedPart === value
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>안내:</strong> 프로젝트 리더가 지원서를 검토한 후 수락/거절 여부를 결정합니다.
            </p>
          </div>
        </div>

        {/* 푸터 */}
        <div className="border-t p-4 bg-gray-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedPart || isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "지원 중..." : "지원하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
