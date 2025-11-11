import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useResponsive from "../hooks/responsive";
import { applyToProject, getProjectById } from "../api/project/ProjectAPI";
import type { ProjectDetail } from "../types/api/project-board";

export default function ProjectApply() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isMobile = useResponsive();

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [selectedPart, setSelectedPart] = useState<PartType | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  type PartType = "FRONTEND" | "BACKEND" | "PM" | "DESIGN" | "AI" | "ETC";

  const partOptions: { label: string; value: PartType }[] = [
    { label: "프론트엔드", value: "FRONTEND" },
    { label: "백엔드", value: "BACKEND" },
    { label: "PM", value: "PM" },
    { label: "디자인", value: "DESIGN" },
    { label: "AI", value: "AI" },
    { label: "기타", value: "ETC" },
  ];

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(Number(id));
        setProject(data);
      } catch (err) {
        alert("잘못된 접근입니다.");
        navigate(-1);
      }
    };

    if (id) fetchProject();
    else navigate(-1);
  }, [id, navigate]);

  const handleSubmit = async () => {
    if (!selectedPart) {
      alert("희망 분야를 선택해주세요!");
      return;
    }
    if (!message.trim()) {
      alert("지원 동기를 작성해주세요!");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        projectId: Number(id),
        part: selectedPart,
        message,
      };

      await applyToProject(Number(id), payload);

      alert(`'${selectedPart}' 분야로 지원이 완료되었습니다!`);
      navigate(`/project/${id}`);
    } catch (error) {
      console.error("지원서 제출 실패:", error);
      alert("지원서 제출 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!project) {
    return <div className="pt-36 text-center text-gray-500">로딩 중...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-36 pb-20">
      <div className="bg-gray-50 shadow-md rounded-lg p-10">
        <h2 className={`text-2xl font-extrabold text-center mb-6 text-blue-900 ${isMobile ? "text-xl" : "text-2xl"}`}>
          {project.projectTitle}에 지원하기
        </h2>

        <h3 className="text-base font-semibold mb-2">✅ 희망하는 분야를 선택해 주세요</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {partOptions.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSelectedPart(value)}
              className={`px-3 py-1 rounded-full border text-sm transition-all duration-150 ${
                selectedPart === value
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              #{label}
            </button>
          ))}
        </div>

        <h3 className="text-base font-semibold mb-2">✏️ 지원 동기를 작성해 주세요</h3>
        <textarea
          className="w-full h-48 p-4 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="왜 이 프로젝트에 관심이 있는지, 어떤 기여를 하고 싶은지 자유롭게 작성해 주세요."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={400}
        />
        <div className="text-sm text-gray-500 text-right mt-1">
          {message.length} / 400
        </div>

        <div className={`flex ${isMobile ? "flex-col gap-2" : "justify-between"} mt-6`}>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-slate-800 text-white text-sm rounded hover:bg-slate-700"
          >
            ← 뒤로 가기
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "제출 중..." : "지원하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
