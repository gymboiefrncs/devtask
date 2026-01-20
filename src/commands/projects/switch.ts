import { switchProjectService } from "../../services/projects.services.js";

export const switchProject = (projectId: string): void => {
  const switchResult = switchProjectService(projectId);
  if (!switchResult.success) {
    console.error(switchResult.error.message);
    process.exitCode = 1;
    return;
  }

  console.log(`Project switched to: ${switchResult.data.name}`);
};
