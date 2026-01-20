import { removeProjectService } from "../../services/projects.services.js";

export const removeProject = (projectId: string): void => {
  const removeResult = removeProjectService(projectId);
  if (!removeResult.success) {
    console.error(removeResult.error.message);
    process.exitCode = 1;
    return;
  }
  console.log("Project deleted");
};
