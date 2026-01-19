import { updateProjectDescriptionService } from "../../services/projects.services.js";

export const editProject = (projectId: string, name: string) => {
  const updatedProject = updateProjectDescriptionService(name, projectId);
  if (!updatedProject.success) {
    console.error(updatedProject.error.message);
    process.exitCode = 1;
    return;
  }
  console.log(`Project ${projectId} name updated to: '${name}'`);
};
