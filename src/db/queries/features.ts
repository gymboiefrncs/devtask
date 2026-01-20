import type { Feature, FeatureRunResult } from "../../types/Features.js";
import { db } from "../database.js";

const stmts = {
  getAllFeatures: db.prepare<[number], Feature>(
    "SELECT * from features WHERE project_id = ?",
  ),
  getFeature: db.prepare<[number], Feature>(
    "SELECT * from features WHERE id = ?",
  ),
  getAllUnfocus: db.prepare<[number], Feature>(
    "SELECT * from features WHERE project_id = ? and  is_focused = 0",
  ),
  getAllFocus: db.prepare<[number], Feature>(
    "SELECT * from features WHERE project_id = ? and  is_focused = 1",
  ),
  insert: db.prepare<[string, number], Feature>(
    "INSERT INTO features (description, project_id) VALUES (?, ?)",
  ),
  batchInsert: db.prepare<[string, number], Feature>(
    "INSERT INTO features (description, project_id) VALUES (?, ?)",
  ),
  insertNotes: db.prepare<[string, number, number], FeatureRunResult>(
    "UPDATE features SET notes = ? WHERE id = ? AND project_id = ?",
  ),
  focus: db.prepare<[number, number], FeatureRunResult>(
    "UPDATE features SET is_focused = 1, status = 'in_progress' WHERE id = ? AND project_id = ?",
  ),
  focusMultiple: db.prepare(
    "UPDATE features SET is_focused = 1, status = 'in_progress' WHERE id = ?",
  ),
  unfocus: db.prepare(
    "UPDATE features SET is_focused = 0, status = 'todo' WHERE id = ?",
  ),
  setStatus: db.prepare<[number, number], FeatureRunResult>(
    "UPDATE features SET is_focused = 0, status = 'done' WHERE id = ? AND project_id = ?",
  ),
  delete: db.prepare("DELETE FROM features WHERE id = ?"),
};

// ============
// GET QUERIES
// ============
export const getAllFeatures = (projectId: number): Feature[] =>
  stmts.getAllFeatures.all(projectId);

export const getFeature = (featId: number): Feature | undefined =>
  stmts.getFeature.get(featId);

export const getAllUnfocusedFeatures = (projectId: number): Feature[] =>
  stmts.getAllUnfocus.all(projectId);

export const getAllFocusedFeatures = (projectId: number): Feature[] =>
  stmts.getAllFocus.all(projectId);

// ===============
// INSERT QUERIES
// ===============
export const insertFeature = (
  description: string,
  projectId: number,
): FeatureRunResult => {
  const result = stmts.insert.run(description, projectId);
  return { changes: result.changes, lastInsertRowid: result.lastInsertRowid };
};
const performInsert = db.transaction((desc: string[], id: number) => {
  let changes = 0;
  let lastInsertRowid: number | bigint = 0;
  for (const d of desc) {
    const feature = stmts.batchInsert.run(d, id);
    changes += feature.changes;
    lastInsertRowid = feature.lastInsertRowid;
  }
  return { changes, lastInsertRowid };
});

export const batchInsert = (
  description: string[],
  projectId: number,
): FeatureRunResult => performInsert(description, projectId);

export const insertNotes = (
  notes: string,
  featId: number,
  projectId: number,
): FeatureRunResult => stmts.insertNotes.run(notes, featId, projectId);

// ==============
// UPDATE QUERIES
// ==============
export const setFocus = (featId: number, projectId: number): FeatureRunResult =>
  stmts.focus.run(featId, projectId);

const performFocus = db.transaction((ids: number[]) => {
  let changes = 0;
  let lastInsertRowid: bigint | number = 0;
  for (const id of ids) {
    const result = stmts.focusMultiple.run(id);
    changes += result.changes;
    lastInsertRowid = result.lastInsertRowid;
  }
  return { changes, lastInsertRowid };
});

export const setMultipleFocus = (featId: number[]): FeatureRunResult =>
  performFocus(featId);

const performUnfocus = db.transaction((ids: number[]) => {
  let changes = 0;
  let lastInsertRowid: bigint | number = 0;
  for (const id of ids) {
    const result = stmts.unfocus.run(id);
    changes += result.changes;
    lastInsertRowid = result.lastInsertRowid;
  }
  return { changes, lastInsertRowid };
});

export const setUnfocus = (featId: number[]): FeatureRunResult =>
  performUnfocus(featId);

export const setStatusDone = (
  featId: number,
  projectId: number,
): FeatureRunResult => stmts.setStatus.run(featId, projectId);

// =============
// DELETE QUERY
// =============
const performDelete = db.transaction((ids: number[]) => {
  let changes = 0;
  let lastInsertRowid: bigint | number = 0;
  for (const id of ids) {
    const result = stmts.delete.run(id);
    changes += result.changes;
    lastInsertRowid = result.lastInsertRowid;
  }
  return { changes, lastInsertRowid };
});

export const deleteFeat = (featId: number[]): FeatureRunResult =>
  performDelete(featId);
