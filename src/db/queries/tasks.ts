import type { Task, TaskRunResult } from "../../types/Tasks.js";
import { db } from "../database.js";

const stmts = {
  insert: db.prepare<[number, string], TaskRunResult>(
    "INSERT INTO tasks (feature_id, description) VALUES (?, ?)",
  ),
  getTasks: db.prepare<[number], Task>(
    "SELECT * FROM tasks WHERE feature_id = ?",
  ),
  markDone: db.prepare<[number, number], TaskRunResult>(
    "UPDATE tasks SET status = 'done' WHERE id = ? AND feature_id = ?",
  ),
  update: db.prepare<[string, number, number], TaskRunResult>(
    "UPDATE tasks SET description = ? WHERE id = ? AND feature_id = ?",
  ),
};

const performInsert = db.transaction((featId, descriptions: string[]) => {
  let changes = 0;
  let lastInsertRowid: number | bigint = 0;
  for (const desc of descriptions) {
    const task = stmts.insert.run(featId, desc);
    changes += task.changes;
    lastInsertRowid = task.lastInsertRowid;
  }
  return { changes, lastInsertRowid };
});

export const batchInsert = (featId: number, description: string[]) => {
  return performInsert(featId, description);
};

export const getAllTasks = (featId: number): Task[] => {
  return stmts.getTasks.all(featId);
};

export const markAsDone = (taskId: number, featId: number): TaskRunResult =>
  stmts.markDone.run(taskId, featId);

export const updateDescription = (
  taskId: number,
  featId: number,
  desc: string,
): TaskRunResult => stmts.update.run(desc, taskId, featId);
