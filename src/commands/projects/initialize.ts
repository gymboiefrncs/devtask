import { initializeProjectService } from "../../services/projects.services.js";

export const initializeProject = (projectName: string): void => {
  const newProject = initializeProjectService(projectName);
  if (!newProject.success) {
    console.error(newProject.error.message);
    process.exitCode = 1;
    return;
  }
  console.log(`Project added: ${projectName}`);
};
