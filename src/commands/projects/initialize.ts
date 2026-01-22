import {
  initializeProjectService,
  switchProjectService,
} from "../../services/projects.services.js";

export const initializeProject = (
  projectName: string,
  options: { switch: boolean },
): void => {
  const addResult = initializeProjectService(projectName);
  if (!addResult.success) {
    console.error(addResult.error.message);
    process.exitCode = 1;
    return;
  }

  if (options.switch) {
    const switchResult = switchProjectService(addResult.data.id);
    console.log(`Switched to newly created project: ${projectName}`);

    if (!switchResult.success) {
      console.error(switchResult.error.message);
      process.exitCode = 1;
      return;
    }
    return;
  }

  console.log(`Project added: ${projectName}`);
};
