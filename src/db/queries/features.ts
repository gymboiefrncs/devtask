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
