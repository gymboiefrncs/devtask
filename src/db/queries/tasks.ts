import type { TaskRunResult } from "../../types/Tasks.js";
import { db } from "../database.js";

const stmts = {
  insert: db.prepare<[number, string], TaskRunResult>(
    "INSERT INTO tasks (feature_id, description) VALUES (?, ?)",
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
