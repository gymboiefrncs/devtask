import * as queries from "../db/queries/projects.js";
import { handleError } from "../utils/handleError.js";
import type { Projects, ServiceResponse } from "../types/Projects.js";

// Serive to initialize new project
export const initializeProjectService = (
  projectName: string
): ServiceResponse<Projects, Error> => {
  if (!projectName.trim()) {
    return { success: false, error: new Error("Project name cannot be empty") };
  }
  const res = handleError(() => queries.addProject(projectName.trim()));
  if (!res.success) {
    const message = res.error.message.includes("UNIQUE")
      ? "Project already exists"
      : res.error.message;
    return { success: false, error: new Error(message) };
  }

  return res;
};

// Service to list all projects
export const listProjectsService = (): ServiceResponse<Projects[], Error> => {
  const res = handleError(() => queries.getAllProjects());
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };

  return res;
};

// Service to switch active project
export const switchProjectService = (
  projectId: number
): ServiceResponse<Projects, Error> => {
  const exist = handleError(() => queries.getProject(projectId));
  if (!exist.success || !exist.data)
    return { success: false, error: new Error("Project not found") };

  const res = handleError(() => queries.setActiveProject(projectId));
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };

  return res;
};

// Service to get the current project
export const listCurrentProjectService = (): ServiceResponse<
  Projects,
  Error
> => {
  const res = handleError(() => queries.getActiveProject());
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };
  if (!res.data)
    return { success: false, error: new Error("No active project found") };

  return { success: true, data: res.data };
};

//service to handle add then switch command
export const addThenSwitchService = (
  projectId: number
): ServiceResponse<Projects, Error> => {
  const res = handleError(() => queries.addThenSwitch(projectId));
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };

  return { success: true, data: res.data };
};
