import { createContext } from "react";
import { mockProjects } from "../constants/mock-projects";

export const ProjectContext = createContext({
  projects: mockProjects,
  setProjects: (_projects: any) => {},
});