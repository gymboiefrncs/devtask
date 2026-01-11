import { removeProjectService } from "../../services/projects.services.js";

export const removeProject = (projectId: string) => {
  const res = removeProjectService(projectId);
  if (!res.success) {
    console.error(res.error.message);
    process.exitCode = 1;
    return;
  }
  console.log("Project deleted");
};
