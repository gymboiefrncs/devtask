import {
  initializeProjectService,
  switchProjectService,
} from "../../services/projects.services.js";

export const initializeProject = (
  projectName: string,
  options: { switch: boolean },
): void => {
  const newProject = initializeProjectService(projectName);
  if (!newProject.success) {
    console.error(newProject.error);
    process.exitCode = 1;
    return;
  }

  if (options.switch) {
    const newActiverProject = switchProjectService(newProject.data.id);
    console.log(`Switched to newly created project: ${projectName}`);

    if (!newActiverProject.success) {
      console.error(newActiverProject.error);
      process.exitCode = 1;
      return;
    }
    return;
  }

  console.log(`Project added: ${projectName}`);
};
