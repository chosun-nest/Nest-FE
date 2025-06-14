// 게시판 글쓰기 버튼
import { useNavigate, useLocation } from "react-router-dom";

export default function BoardWriteButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = () => {
    const currentPath = location.pathname;

    if (currentPath.startsWith("/project-board")) {
      navigate("/project-write");
    } else if (currentPath.startsWith("/interests-board")) {
      navigate("/interests-write");
    }
    // board-write 경로는 더 이상 사용하지 않으므로 else 생략
  };

  return (
    <button
      className="fixed bottom-8 left-8 px-5 py-3 bg-[#002F6C] text-white rounded-full shadow-lg hover:bg-[#001f4d]"
      onClick={handleNavigate}
    >
      ✏️ 글쓰기
    </button>
  );
}
