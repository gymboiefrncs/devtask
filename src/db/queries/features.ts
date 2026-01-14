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
