import {
  initializeProjectService,
  switchProjectService,
} from "../../services/projects.services.js";

export const initializeProject = (
  projectName: string,
  options: { switch: boolean },
): void => {
  const addResult = initializeProjectService(projectName);
  if (!addResult.ok) {
    console.error(addResult.err.message);
    process.exitCode = 1;
    return;
  }

  if (options.switch) {
    const switchResult = switchProjectService(addResult.data.id);
    if (!switchResult.ok) {
      console.error(switchResult.err.message);
      process.exitCode = 1;
      return;
    }

    console.log(`Switched project: '${switchResult.data.name}'`);

    return;
  }

  console.log(`Project added: '${addResult.data.name}'`);
};
