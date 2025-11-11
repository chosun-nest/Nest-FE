import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTopProjects } from "../../../utils/getTopProjects";

type Project = {
  id: number;
  title: string;
  content: string;
  date: string;
  author: { id: number; name: string };
  views: number;
  status: "모집중" | "모집완료";
  tags: string[];
};

export default function HomeProject() {
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const top = await getTopProjects({ size: 5 });
      const mapped = top.map(
        (p): Project => ({
          id: p.projectId,
          title: p.projectTitle,
          content: p.previewContent,
          date: p.createdAt.replace("T", " ").slice(0, 16),
          author: { id: p.author.id, name: p.author.name },
          views: p.viewCount,
          status: p.isRecruiting ? "모집중" : "모집완료",
          tags: p.tags,
        })
      );
      setProjects(mapped);
    };
    fetchProjects();
  }, []);

  const handleClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => handleClick(project.id)}
          className="relative p-4 border rounded-lg cursor-pointer hover:shadow-sm transition"
        >
          {/* 상태 배지 */}
          <div className="absolute top-4 right-4">
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full border ${
                project.status === "모집중"
                  ? "text-green-700 bg-green-100 border-green-300"
                  : "text-gray-500 bg-gray-100 border-gray-300"
              }`}
            >
              {project.status}
            </span>
          </div>

          {/* 제목 */}
          <h2 className="text-lg font-semibold mb-1">{project.title}</h2>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2 mb-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 작성자, 날짜, 조회수 */}
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {project.author.name} · {project.date}
            </span>
            <span>조회수 {project.views}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
