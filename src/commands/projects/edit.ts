import { updateProjectNameService } from "../../services/projects.services.js";

export const editProject = (projectId: string, name: string) => {
  const updateResult = updateProjectNameService(name, projectId);
  if (!updateResult.ok) {
    console.error(updateResult.err.message);
    process.exitCode = 1;
    return;
  }
  console.log(
    `Project (${projectId}) name updated to: '${updateResult.data.name}'`,
  );
};
