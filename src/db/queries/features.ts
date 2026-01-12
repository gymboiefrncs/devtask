import type { Feature, FeatureRunResult } from "../../types/Features.js";
import { db } from "../database.js";

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
