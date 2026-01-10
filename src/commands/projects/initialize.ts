import {
  initializeProjectService,
  addThenSwitchService,
} from "../../services/projects.services.js";

export const initializeProject = (
  projectName: string,
  options: { s: string; switch: string }
): void => {
  const newProject = initializeProjectService(projectName);
  if (!newProject.success) {
    console.error(newProject.error.message);
    process.exitCode = 1;
    return;
  }

  if (options.s || options.switch) {
    const newActiverProject = addThenSwitchService(newProject.data.id);
    console.log("Switched to added project");

    if (!newActiverProject.success) {
      console.error(newActiverProject.error);
      process.exitCode = 1;
      return;
    }
    return;
  }

  console.log(`Project added: ${projectName}`);
};
