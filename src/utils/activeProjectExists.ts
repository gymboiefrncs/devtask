import { handleError } from "./handleError.js";
import { getActiveProject } from "../db/queries/projects.js";
import type { Projects, Result } from "../types/Projects.js";

export const activeprojectExist = (): Result<Projects> => {
  const activeProject = handleError(() => getActiveProject());
  if (!activeProject.success)
    return { success: false, error: activeProject.error };

  const projectData = activeProject.data;
  if (!projectData)
    return { success: false, error: new Error("No active project found") };

  return { success: true, data: projectData };
};
