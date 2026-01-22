import * as queries from "../db/queries/projects.js";
import {
  handleError,
  NotFoundError,
  ValidationError,
} from "../utils/handleError.js";
import type { ProjectRunResult, Projects, Result } from "../types/Projects.js";
import { validateProjectName } from "../utils/validateProjectName.js";
import { ensureValidId } from "../utils/ensureValidId.js";
import { ConflictError, DatabaseError } from "../utils/handleError.js";

// Serive to initialize new project
export const initializeProjectService = (
  projectName: string,
): Result<Projects> => {
  const validName: string | ValidationError = validateProjectName(projectName);
  if (validName instanceof ValidationError)
    return { ok: false, err: validName };

  const result = handleError(() => queries.addProject(validName));
  if (!result.ok) {
    if (result.err.message.includes("UNIQUE")) {
      return { ok: false, err: new ConflictError("Project already exist!") };
    }

    return { ok: false, err: new DatabaseError(result.err.message) };
  }

  return result;
};

// Service to list all projects
export const getProjectsService = (): Result<Projects[]> => {
  const result = handleError(() => queries.getAllProjects());
  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };

  return result;
};

// Service to switch active project
export const switchProjectService = (
  projectId: string | number,
): Result<Projects> => {
  // ensure id is valid
  const validId: number | ValidationError = ensureValidId(projectId);
  if (validId instanceof ValidationError) return { ok: false, err: validId };

  const exist = handleError(() => queries.getProject(validId));
  if (!exist.ok)
    return { ok: false, err: new DatabaseError(exist.err.message) };
  if (!exist.data)
    return { ok: false, err: new NotFoundError("Project not found") };

  const result = handleError(() => queries.setActiveProject(validId));
  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };

  return result;
};

// Service to get the current project
export const getCurrentProjectService = (): Result<Projects> => {
  const result = handleError(() => queries.getActiveProject());
  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };
  if (!result.data)
    return { ok: false, err: new NotFoundError("No active project found") };

  return { ok: true, data: result.data };
};

// Service to remove project
export const removeProjectService = (
  projectId: string,
): Result<ProjectRunResult> => {
  // ensure id is valid
  const validId: number | ValidationError = ensureValidId(projectId);
  if (validId instanceof ValidationError) return { ok: false, err: validId };

  // check if the provided project is active
  // refuse to delete if the provided project is active
  const isActive = handleError(() => queries.getActiveProject());
  if (!isActive.ok)
    return {
      ok: false,
      err: new DatabaseError(isActive.err.message),
    };
  if (isActive.data?.id === validId)
    return {
      ok: false,
      err: new ConflictError("Cannot delete this active project!"),
    };

  const result = handleError(() => queries.deleteProject(validId));
  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };
  if (!result.data.changes)
    return { ok: false, err: new NotFoundError("Project not found") };

  return result;
};

// Service to update project name
export const updateProjectNameService = (
  projectName: string,
  projectId: string,
): Result<Projects> => {
  const validId: number | ValidationError = ensureValidId(projectId);
  if (validId instanceof ValidationError) return { ok: false, err: validId };

  const validName = validateProjectName(projectName);
  if (validName instanceof ValidationError)
    return { ok: false, err: validName };

  const exist = handleError(() => queries.getProject(validId));
  if (!exist.ok)
    return { ok: false, err: new DatabaseError(exist.err.message) };
  if (!exist.data)
    return { ok: false, err: new NotFoundError("Project not found") };

  const result = handleError(() =>
    queries.updateProjectName(validName, validId),
  );
  if (!result.ok) {
    if (result.err.message.includes("UNIQUE")) {
      return { ok: false, err: new ConflictError("Project already exist!") };
    }
    return { ok: false, err: new DatabaseError(result.err.message) };
  }

  return result;
};
