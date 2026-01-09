import { switchProjectService } from "../../services/projects.services.js";

export const switchProject = (projectId: number) => {
  const newActiveProject = switchProjectService(projectId);
  if (!newActiveProject.success) {
    console.error(newActiveProject.error);
    return;
  }

  console.log("project switched to: ", newActiveProject.data.name);
};
