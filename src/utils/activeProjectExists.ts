import { handleError, DatabaseError, NotFoundError } from "./handleError.js";
import { getActiveProject } from "../db/queries/projects.js";
import type { Projects, Result } from "../types/Projects.js";

export const activeprojectExist = (): Result<Projects> => {
  const activeProject = handleError(() => getActiveProject());
  if (!activeProject.ok) return { ok: false, err: activeProject.err };

  const projectData = activeProject.data;
  if (!projectData)
    return { ok: false, err: new Error("No active project found") };

  return { ok: true, data: projectData };
};

export const requireActiveProject = (): Result<Projects> => {
  const project = activeprojectExist();
  if (!project.ok)
    return { ok: false, err: new DatabaseError(project.err.message) };
  if (!project.data)
    return {
      ok: false,
      err: new NotFoundError("No active project. Please create one first"),
    };
  return { ok: true, data: project.data };
};
