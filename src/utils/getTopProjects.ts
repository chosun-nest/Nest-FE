import { mockProjects } from "../constants/mock-projects";
interface Params {
  selectedTags?: string[];
  searchTerm?: string;
  filter?: "전체" | "모집중" | "모집완료";
  size?: number; // 최대 가져올 개수
}

export const getTopProjects = ({
  selectedTags = [],
  searchTerm = "",
  filter = "전체",
  size = 5,
}: Params) => {
  const fixedProjects = mockProjects.map((project) => {
    if (project.status === "모집완료") {
      const [curr, max] = project.participants.split("/");
      if (curr !== max) {
        return { ...project, participants: `${max}/${max}` };
      }
    }
    return project;
  });

  const filteredProjects = [...fixedProjects]
    .sort(
      (a, b) =>
        new Date(b.date.replace(/\./g, "-")).getTime() -
        new Date(a.date.replace(/\./g, "-")).getTime()
    )
    .filter(
      (p) => p.title.includes(searchTerm) || p.content.includes(searchTerm)
    )
    .filter((p) => {
      if (
        selectedTags.length > 0 &&
        !p.tags?.some((tag) => selectedTags.includes(tag))
      )
        return false;
      if (filter !== "전체" && p.status !== filter) return false;
      return true;
    });

  return filteredProjects.slice(0, size);
};
