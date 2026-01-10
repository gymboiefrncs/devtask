import { listCurrentProjectService } from "../../services/projects.services.js";

export const listCurrentProject = (): void => {
  const currentProject = listCurrentProjectService();
  if (!currentProject.success) {
    console.error(currentProject.error);
    process.exitCode = 1;
    return;
  }
  console.log("Current project: ", currentProject);
};
