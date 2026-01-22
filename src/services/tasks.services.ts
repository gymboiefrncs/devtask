import {
  ConflictError,
  DatabaseError,
  handleError,
} from "../utils/handleError.js";
import { validateDescription } from "../utils/validateFeatDescription.js";
import * as queries from "../db/queries/tasks.js";
import type { Result } from "../types/Projects.js";
import type { Task, TaskRunResult } from "../types/Tasks.js";
import { validateId } from "../utils/ensureValidId.js";

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
