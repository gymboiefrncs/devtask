import { addProject } from "../db/queries/projects.js";
import { handleError } from "../utils/handleError.js";

export const initializeProjectService = (projectName: string) => {
  if (!projectName.trim()) {
    return { success: false, error: "Project name cannot be empty" };
  }
  const [result, error] = handleError(() => addProject(projectName));
  if (error) return { success: false, error: "Project name already exist!" };

  return { success: true, data: result };
};
