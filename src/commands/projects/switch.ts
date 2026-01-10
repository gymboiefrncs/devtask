import { switchProjectService } from "../../services/projects.services.js";

export const switchProject = (projectId: number) => {
  const newActiveProject = switchProjectService(projectId);
  if (!newActiveProject.success) {
    console.error(newActiveProject.error.message);
    process.exitCode = 1;
    return;
  }

  console.log("Project switched");
};
