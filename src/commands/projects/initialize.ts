import { initializeProjectService } from "../../services/projects.services.js";

export const initializeProject = (projectName: string) => {
  const newProject = initializeProjectService(projectName);
  if (!newProject.success) {
    console.error(newProject.error);
    process.exitCode = 1;
    return;
  }
  console.log(`Project added: ${projectName}`);
};
