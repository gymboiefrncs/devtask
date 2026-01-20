import * as queries from "../db/queries/projects.js";
import { handleError } from "../utils/handleError.js";
import type { ProjectRunResult, Projects, Result } from "../types/Projects.js";
import { validateProjectName } from "../utils/validateProjectName.js";
import { ensureValidId } from "../utils/ensureValidId.js";

// Serive to initialize new project
export const initializeProjectService = (
  projectName: string,
): Result<Projects, Error> => {
  const name = projectName.trim();
  const error = validateProjectName(name);
  if (error) return { success: false, error };

  const res = handleError(() => queries.addProject(name));
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
): Result<Projects, Error> => {
  // ensure id is valid
  const idRes = ensureValidId(projectId);
  if (idRes instanceof Error) return { success: false, error: idRes };

  const exist = handleError(() => queries.getProject(idRes));
  if (!exist.success || !exist.data)
    return { success: false, error: new Error("Project not found") };

  const res = handleError(() => queries.setActiveProject(idRes));
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
): Result<ProjectRunResult, Error> => {
  // ensure id is valid
  const idRes = ensureValidId(projectId);
  if (idRes instanceof Error) return { success: false, error: idRes };

  // check if the provided project is active
  // refuse to delete if the provided project is active
  const isActive = handleError(() => queries.getActiveProject());
  if (!isActive.success)
    return {
      success: false,
      error: new Error("Command failed. Please try again"),
    };
  if (isActive.data?.id === idRes)
    return {
      success: false,
      error: new Error("Cannot delete this active project"),
    };

  const res = handleError(() => queries.deleteProject(idRes));
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
  const idRes = ensureValidId(projectId);
  if (idRes instanceof Error) return { success: false, error: idRes };

  const name = projectName.trim();
  const error = validateProjectName(name);
  if (error) return { success: false, error };

  const res = handleError(() => queries.updateProjectName(name, idRes));
  if (!res.success) return { success: false, error: res.error };

  return res;
};
