import type { Feature, FeatureRunResult } from "../../types/Features.js";
import { db } from "../database.js";

export const getAllFeature = (projectId: number): Feature[] => {
  return db
    .prepare<[number], Feature>("SELECT * from features WHERE project_id = ?")
    .all(projectId);
};

export const insertFeature = (
  description: string,
  projectId: number
): FeatureRunResult => {
  const result = db
    .prepare<[string, number], Feature>(
      "INSERT INTO features (description, project_id) VALUES (?, ?)"
    )
    .run(description, projectId);
  return { changes: result.changes, lastInsertRowid: result.lastInsertRowid };
};

export const batchInsert = (
  description: string[],
  projectId: number
): FeatureRunResult => {
  const performInsert = db.transaction((desc: string[], id: number) => {
    let changes = 0;
    let lastInsertRowid: number | bigint = 0;
    for (const d of desc) {
      const feature = db
        .prepare<[string, number], Feature>(
          "INSERT INTO features (description, project_id) VALUES (?, ?)"
        )
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

export const setFocus = (featId: number): FeatureRunResult => {
  const result = db
    .prepare<[number], FeatureRunResult>(
      "UPDATE features SET is_focused = 1 WHERE id = ?"
    )
    .run(featId);

  return result;
};

export const setMultipleFocus = (featId: number[]): FeatureRunResult => {
  const performAction = db.transaction((ids: number[]) => {
    let changes = 0;
    let lastInsertRowid: bigint | number = 0;
    for (const id of ids) {
      const result = db
        .prepare("UPDATE features SET is_focused = 1 WHERE id = ?")
        .run(id);
      changes += result.changes;
      lastInsertRowid = result.lastInsertRowid;
    }
    return { changes, lastInsertRowid };
  });
  return performAction(featId);
};
