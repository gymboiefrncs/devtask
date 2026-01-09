import * as queries from "../db/queries/projects.js";
import { handleError } from "../utils/handleError.js";

export const initializeProjectService = (projectName: string) => {
  if (!projectName.trim()) {
    return { success: false, error: "Project name cannot be empty" };
  }
  const [result, error] = handleError(() => queries.addProject(projectName));
  if (error) return { success: false, error: "Project name already exist!" };

  return { success: true, data: result };
};

export const listProjectsService = () => {
  const [result, error] = handleError(() => queries.getAllProjects());
  if (error) return { success: false, error: error.message };

  return { success: true, data: result };
};
