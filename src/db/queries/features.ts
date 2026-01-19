import type { Feature, FeatureRunResult } from "../../types/Features.js";
import { db } from "../database.js";

export const getAllFeatures = (projectId: number): Feature[] => {
  return db
    .prepare<[number], Feature>("SELECT * from features WHERE project_id = ?")
    .all(projectId);
};

export const insertFeature = (
  description: string,
  projectId: number,
): FeatureRunResult => {
  const result = db
    .prepare<
      [string, number],
      Feature
    >("INSERT INTO features (description, project_id) VALUES (?, ?)")
    .run(description, projectId);
  return { changes: result.changes, lastInsertRowid: result.lastInsertRowid };
};

export const batchInsert = (
  description: string[],
  projectId: number,
): FeatureRunResult => {
  const performInsert = db.transaction((desc: string[], id: number) => {
    let changes = 0;
    let lastInsertRowid: number | bigint = 0;
    for (const d of desc) {
      const feature = db
        .prepare<
          [string, number],
          Feature
        >("INSERT INTO features (description, project_id) VALUES (?, ?)")
        .run(d, id);
      changes += feature.changes;
      lastInsertRowid = feature.lastInsertRowid;
    }
    return { changes, lastInsertRowid };
  });
  return performInsert(description, projectId);
};

export const getFeature = (featId: number): Feature | undefined => {
  return db
    .prepare<[number], Feature>("SELECT * from features WHERE id = ?")
    .get(featId);
};

export const setFocus = (
  featId: number,
  projectId: number,
): FeatureRunResult => {
  const result = db
    .prepare<
      [number, number],
      FeatureRunResult
    >("UPDATE features SET is_focused = 1, status = 'in_progress' WHERE id = ? AND project_id = ?")
    .run(featId, projectId);

  return result;
};

export const getAllUnfocusedFeatures = (projectId: number): Feature[] => {
  return db
    .prepare<
      [number],
      Feature
    >("SELECT * from features WHERE project_id = ? and  is_focused = 0")
    .all(projectId);
};

export const getAllFocusedFeatures = (projectId: number): Feature[] => {
  return db
    .prepare<
      [number],
      Feature
    >("SELECT * from features WHERE project_id = ? and  is_focused = 1")
    .all(projectId);
};

export const setMultipleFocus = (featId: number[]): FeatureRunResult => {
  const performAction = db.transaction((ids: number[]) => {
    let changes = 0;
    let lastInsertRowid: bigint | number = 0;
    for (const id of ids) {
      const result = db
        .prepare(
          "UPDATE features SET is_focused = 1, status = 'in_progress' WHERE id = ?",
        )
        .run(id);
      changes += result.changes;
      lastInsertRowid = result.lastInsertRowid;
    }
    return { changes, lastInsertRowid };
  });
  return performAction(featId);
};

export const setUnfocus = (featId: number[]): FeatureRunResult => {
  const performAction = db.transaction((ids: number[]) => {
    let changes = 0;
    let lastInsertRowid: bigint | number = 0;
    for (const id of ids) {
      const result = db
        .prepare(
          "UPDATE features SET is_focused = 0, status = 'todo' WHERE id = ?",
        )
        .run(id);
      changes += result.changes;
      lastInsertRowid = result.lastInsertRowid;
    }
    return { changes, lastInsertRowid };
  });
  return performAction(featId);
};

export const setStatusDone = (
  featId: number,
  projectId: number,
): FeatureRunResult => {
  return db
    .prepare<
      [number, number],
      FeatureRunResult
    >("UPDATE features SET is_focused = 0, status = 'done' WHERE id = ? AND project_id = ?")
    .run(featId, projectId);
};

export const deleteFeat = (featId: number[]): FeatureRunResult => {
  const performAction = db.transaction((ids: number[]) => {
    let changes = 0;
    let lastInsertRowid: bigint | number = 0;
    for (const id of ids) {
      const result = db.prepare("DELETE FROM features WHERE id = ?").run(id);
      changes += result.changes;
      lastInsertRowid = result.lastInsertRowid;
    }
    return { changes, lastInsertRowid };
  });
  return performAction(featId);
};

export const insertNotes = (
  notes: string,
  featId: number,
): FeatureRunResult => {
  return db
    .prepare<
      [string, number],
      FeatureRunResult
    >("UPDATE features SET notes = ? WHERE id = ?")
    .run(notes, featId);
};
