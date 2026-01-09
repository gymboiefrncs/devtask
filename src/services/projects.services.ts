import * as queries from "../db/queries/projects.js";
import { handleError } from "../utils/handleError.js";
import type {
  Projects,
  RunProjectResult,
  ServiceResponse,
} from "../types/Projects.js";

// Serive to initialize new project
export const initializeProjectService = (
  projectName: string
): ServiceResponse<RunProjectResult> => {
  if (!projectName.trim()) {
    return { success: false, error: "Project name cannot be empty" };
  }
  const [result, error] = handleError(() => queries.addProject(projectName));
  if (error)
    return {
      success: false,
      error: error.message.includes("UNIQUE")
        ? "Project already exists"
        : error.message,
    };

  return { success: true, data: result };
};

// Service to list all projects
export const listProjectsService = (): ServiceResponse<Projects[]> => {
  const [result, error] = handleError(() => queries.getAllProjects());
  if (error) return { success: false, error: error.message };

  return { success: true, data: result };
};

// Service to switch active project
export const switchProjectService = (
  projectId: number
): ServiceResponse<Projects> => {
  const [result, error] = handleError(() =>
    queries.setActiveProject(projectId)
  );
  if (error) return { success: false, error: error.message };

  return { success: true, data: result };
};
