// 4. 프로젝트 등록 완료

import { useNavigate } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface Props {
  projectId: number | null;
}

export default function ProjectWriteComplete({ projectId }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4">
      <CheckCircleIcon className="w-20 h-20 text-green-700 mb-4" />
      <h2 className="text-2xl font-bold mb-2">프로젝트 등록 완료!</h2>
      <p className="text-gray-600 mb-6">
        프로젝트가 성공적으로 등록되었습니다.
        <br />
        등록한 프로젝트를 확인해보세요.
      </p>
      <div className="flex gap-3">
        {projectId && (
          <button
            onClick={() => navigate(`/project/${projectId}`)}
            className="px-6 py-3 rounded bg-[#002F6C] text-white hover:bg-[#001f4d] transition-colors"
          >
            등록한 프로젝트 보기
          </button>
        )}
        <button
          onClick={() => navigate("/project-board")}
          className="px-6 py-3 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        >
          프로젝트 게시판으로 이동
        </button>
      </div>
    </div>
  );
}
