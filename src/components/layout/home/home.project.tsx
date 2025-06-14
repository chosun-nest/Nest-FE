import { useEffect, useState } from "react";
import { getTopProjects } from "../../../utils/getTopProjects";

type Project = {
  id: number;
  title: string;
  content: string;
  date: string;
  author: { id: number; name: string };
  views: number;
  participants: string;
  hasAttachment: boolean;
  status: string;
  tags: string[];
};

export default function HomeProject() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const top = getTopProjects({
      selectedTags: ["React", "AI"], // 관심 태그
      filter: "모집중",
      size: 5,
    });
    setProjects(top);
  }, []);

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="border p-4 rounded hover:shadow">
          <h2 className="font-bold text-lg">{project.title}</h2>
          <p className="text-sm text-gray-700">
            {project.content.slice(0, 100)}...
          </p>
          <div className="text-xs text-gray-500 mt-2">
            {project.author.name} · {project.date} · 조회수 {project.views}
          </div>
        </div>
      ))}
    </div>
  );
}
