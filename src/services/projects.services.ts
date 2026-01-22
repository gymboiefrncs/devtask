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
      ? "Project already exists"
      : res.error.message;
    return { success: false, error: new Error(message) };
  }

  return res;
};

// Service to list all projects
export const getProjectsService = (): Result<Projects[], Error> => {
  const res = handleError(() => queries.getAllProjects());
  if (!res.success) return { success: false, error: res.error };

  return res;
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

  const res = handleError(() => queries.setActiveProject(validId));
  if (!res.success) return { success: false, error: res.error };

  return res;
};

// Service to get the current project
export const getCurrentProjectService = (): Result<Projects, Error> => {
  const res = handleError(() => queries.getActiveProject());
  if (!res.success) return { success: false, error: res.error };
  if (!res.data)
    return { success: false, error: new Error("No active project found") };

  return { success: true, data: res.data };
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
      error: new Error("Cannot delete this active project"),
    };

  const res = handleError(() => queries.deleteProject(validId));
  if (!res.success) return { success: false, error: res.error };
  if (!res.data.changes)
    return { success: false, error: new Error("Project not found") };

  return res;
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

  const res = handleError(() => queries.updateProjectName(validName, validId));
  if (!res.success) return { success: false, error: res.error };

  return res;
};
