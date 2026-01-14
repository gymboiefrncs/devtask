import { handleError } from "../utils/handleError.js";
import { getActiveProject } from "../db/queries/projects.js";
import {
  batchInsert,
  getAllFeature,
  insertFeature,
} from "../db/queries/features.js";
import type { Result } from "../types/Projects.js";
import type { Feature, FeatureRunResult } from "../types/Features.js";
import { validateFeatureDescription } from "../utils/validateFeatDescription.js";

export const listAllFeaturesService = (): Result<Feature[]> => {
  const activeProject = handleError(() => getActiveProject());
  if (!activeProject.success)
    return { success: false, error: new Error(activeProject.error.message) };

  const projectData = activeProject.data;
  if (!projectData)
    return { success: false, error: new Error("No active project found") };

  const res = handleError(() => getAllFeature(projectData.id));
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };

  return res;
};

export const addFeatureService = (
  description: string
): Result<FeatureRunResult> => {
  const desc = description.trim();
  const error = validateFeatureDescription(desc);

  if (error) return { success: false, error };

  const activeProject = handleError(() => getActiveProject());
  if (!activeProject.success)
    return { success: false, error: new Error(activeProject.error.message) };

  const projectData = activeProject.data;
  if (!projectData)
    return { success: false, error: new Error("No active project found") };

  const res = handleError(() => insertFeature(description, projectData.id));
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };

  return res;
};

export const addMultipleFeatureService = (
  description: string[]
): Result<FeatureRunResult> => {
  for (const desc of description) {
    const error = validateFeatureDescription(desc.trim());
    if (error) return { success: false, error };
  }

  const activeProject = handleError(() => getActiveProject());
  if (!activeProject.success)
    return { success: false, error: new Error(activeProject.error.message) };

  const projectData = activeProject.data;
  if (!projectData)
    return { success: false, error: new Error("No active project found") };

  const res = handleError(() => batchInsert(description, projectData.id));
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };
  return res;
};
