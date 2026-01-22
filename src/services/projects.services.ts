import * as queries from "../db/queries/projects.js";
import { handleError } from "../utils/handleError.js";
import type { ProjectRunResult, Projects, Result } from "../types/Projects.js";
import { validateProjectName } from "../utils/validateProjectName.js";
import { ensureValidId } from "../utils/ensureValidId.js";

// Serive to initialize new project
export const initializeProjectService = (
  projectName: string,
): Result<Projects> => {
  const validName: string | Error = validateProjectName(projectName);
  if (validName instanceof Error) return { success: false, error: validName };

  const res = handleError(() => queries.addProject(validName));
  if (!res.success) {
    const message = res.error.message.includes("UNIQUE")
      ? "Project already exists!"
      : res.error.message;
    return { success: false, error: new Error(message) };
  }

  return res;
};

// Service to list all projects
export const getProjectsService = (): Result<Projects[], Error> => {
  const result = handleError(() => queries.getAllProjects());
  if (!result.success) return { success: false, error: result.error };

  return result;
};

// Service to switch active project
export const switchProjectService = (
  projectId: string | number,
): Result<Projects> => {
  // ensure id is valid
  const validId: number | Error = ensureValidId(projectId);
  if (validId instanceof Error) return { success: false, error: validId };

  const exist = handleError(() => queries.getProject(validId));
  if (!exist.success || !exist.data)
    return { success: false, error: new Error("Project not found") };

  const result = handleError(() => queries.setActiveProject(validId));
  if (!result.success) return { success: false, error: result.error };

  return result;
};

// Service to get the current project
export const getCurrentProjectService = (): Result<Projects, Error> => {
  const result = handleError(() => queries.getActiveProject());
  if (!result.success) return { success: false, error: result.error };
  if (!result.data)
    return { success: false, error: new Error("No active project found") };

  return { success: true, data: result.data };
};

// Service to remove project
export const removeProjectService = (
  projectId: string,
): Result<ProjectRunResult> => {
  // ensure id is valid
  const validId: number | Error = ensureValidId(projectId);
  if (validId instanceof Error) return { success: false, error: validId };

  // check if the provided project is active
  // refuse to delete if the provided project is active
  const isActive = handleError(() => queries.getActiveProject());
  if (!isActive.success)
    return {
      success: false,
      error: new Error("Command failed. Please try again"),
    };
  if (isActive.data?.id === validId)
    return {
      success: false,
      error: new Error("Cannot delete this active project!"),
    };

  const result = handleError(() => queries.deleteProject(validId));
  if (!result.success) return { success: false, error: result.error };
  if (!result.data.changes)
    return { success: false, error: new Error("Project not found") };

  return result;
};

// Service to update project name
export const updateProjectNameService = (
  projectName: string,
  projectId: string,
): Result<ProjectRunResult> => {
  const validId: number | Error = ensureValidId(projectId);
  if (validId instanceof Error) return { success: false, error: validId };

  const validName = validateProjectName(projectName);
  if (validName instanceof Error) return { success: false, error: validName };

  const result = handleError(() =>
    queries.updateProjectName(validName, validId),
  );
  if (!result.success) return { success: false, error: result.error };

  return result;
};
