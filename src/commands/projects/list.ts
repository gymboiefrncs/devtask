import { listProjectsService } from "../../services/projects.services.js";

export const listProjects = () => {
  const projects = listProjectsService();
  if (!projects.success) {
    console.error(projects.error);
    process.exitCode = 1;
    return;
  }

  if (!projects.data?.length) {
    console.log("No projects found!");
    return;
  }

  console.log(projects.data);
};
