import {
  ConflictError,
  DatabaseError,
  handleError,
  NotFoundError,
} from "../utils/handleError.js";
import { validateDescription } from "../utils/validateFeatDescription.js";
import * as queries from "../db/queries/tasks.js";
import type { Result } from "../types/Projects.js";
import type { Task, TaskRunResult } from "../types/Tasks.js";
import { validateId } from "../utils/ensureValidId.js";
import { requireActiveProject } from "../utils/activeProjectExists.js";
import { getFocusedFeatures } from "../db/queries/features.js";

export const addTaskService = (
  featId: number,
  description: string[],
): Result<TaskRunResult> => {
  if (!featId)
    return { ok: false, err: new ConflictError("NO feature provided") };
  const sanitized: string[] = [];
  for (const rawDesc of description) {
    const descCheck = validateDescription(rawDesc);
    if (!descCheck.ok) return descCheck;
    sanitized.push(descCheck.data);
  }

  if (!sanitized.length)
    return { ok: false, err: new ConflictError("No tasks added") };

  const result = handleError(() => queries.batchInsert(featId, sanitized));
  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };

  return result;
};

export const getAllTasksService = (featId: string): Result<Task[]> => {
  const idCheck = validateId(featId);
  if (!idCheck.ok) return idCheck;

  const result = handleError(() => queries.getAllTasks(idCheck.data));
  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };
  return result;
};

export const markAsDoneService = (taskId: string): Result<TaskRunResult> => {
  const idCheck = validateId(taskId);
  if (!idCheck.ok) return idCheck;

  const projectCheck = requireActiveProject();
  if (!projectCheck.ok) return projectCheck;

  const focused = handleError(() => getFocusedFeatures(projectCheck.data.id));
  if (!focused.ok)
    return { ok: false, err: new DatabaseError(focused.err.message) };
  const data = focused.data;
  if (!data)
    return {
      ok: false,
      err: new NotFoundError("No focused feature found"),
    };
  const result = handleError(() => queries.markAsDone(idCheck.data, data.id));
  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };

  return result;
};

export const updateTaskDescriptionService = (
  taskId: string,
  description: string,
): Result<TaskRunResult> => {
  const idCheck = validateId(taskId);
  if (!idCheck.ok) return idCheck;
  const descCheck = validateDescription(description);
  if (!descCheck.ok) return descCheck;
  const projectCheck = requireActiveProject();
  if (!projectCheck.ok) return projectCheck;

  const focused = handleError(() => getFocusedFeatures(projectCheck.data.id));
  if (!focused.ok)
    return { ok: false, err: new DatabaseError(focused.err.message) };
  const data = focused.data;
  if (!data)
    return {
      ok: false,
      err: new NotFoundError("No focused feature found"),
    };
  const result = handleError(() =>
    queries.updateDescription(idCheck.data, data.id, descCheck.data),
  );

  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };

  return result;
};

export const removeTaskService = (taskId: string) => {
  const projectCheck = requireActiveProject();
  const idCheck = validateId(taskId);
  if (!idCheck.ok) return idCheck;

  if (!projectCheck.ok) return projectCheck;

  const focused = handleError(() => getFocusedFeatures(projectCheck.data.id));
  if (!focused.ok)
    return { ok: false, err: new DatabaseError(focused.err.message) };
  const data = focused.data;
  if (!data)
    return {
      ok: false,
      err: new NotFoundError("No focused feature found"),
    };

  const result = handleError(() => queries.removeTask(idCheck.data, data.id));

  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };
  return result;
};
