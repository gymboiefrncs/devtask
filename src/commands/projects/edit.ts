import { updateProjectNameService } from "../../services/projects.services.js";

export const editProject = (projectId: string, name: string) => {
  const updateResult = updateProjectNameService(name, projectId);
  if (!updateResult.success) {
    console.error(updateResult.error.message);
    process.exitCode = 1;
    return;
  }
  console.log(`Project ${projectId} name updated to: '${name}'`);
};
