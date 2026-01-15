import { handleError } from "../utils/handleError.js";
import { getActiveProject } from "../db/queries/projects.js";
import {
  batchInsert,
  getAllFeature,
  getAllUnfocusedFeatures,
  getFeature,
  insertFeature,
  setFocus,
  setMultipleFocus,
  getAllfocusedFeatures,
  setUnfocus,
  setStatusDone,
} from "../db/queries/features.js";
import type { Result } from "../types/Projects.js";
import type { Feature, FeatureRunResult } from "../types/Features.js";
import { validateFeatureDescription } from "../utils/validateFeatDescription.js";
import { ensureValidId } from "../utils/ensureValidId.js";

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

export const focusAFeatureService = (
  featId: string
): Result<FeatureRunResult> => {
  const idRes = ensureValidId(featId);
  if (idRes instanceof Error) return { success: false, error: idRes };

  const feature = handleError(() => getFeature(idRes));
  if (!feature.success)
    return { success: false, error: new Error(feature.error.message) };
  const featureData = feature.data;
  if (!featureData)
    return { success: false, error: new Error("No feature found!") };

  const res = handleError(() => setFocus(idRes));
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };

  return res;
};

export const unfocusedFeatures = (): Result<Feature[]> => {
  const activeProject = handleError(() => getActiveProject());
  if (!activeProject.success)
    return { success: false, error: new Error(activeProject.error.message) };

  const projectData = activeProject.data;
  if (!projectData)
    return { success: false, error: new Error("No active project found") };

  const res = handleError(() => getAllUnfocusedFeatures(projectData.id));
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };

  return res;
};

export const focusMultipleFeaureService = (
  feats: number[]
): Result<FeatureRunResult> => {
  const res = handleError(() => setMultipleFocus(feats));
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };
  return res;
};

export const focusedFeatures = (): Result<Feature[]> => {
  const activeProject = handleError(() => getActiveProject());
  if (!activeProject.success)
    return { success: false, error: new Error(activeProject.error.message) };

  const projectData = activeProject.data;
  if (!projectData)
    return { success: false, error: new Error("No active project found") };

  const res = handleError(() => getAllfocusedFeatures(projectData.id));
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };

  return res;
};

export const unfocusMultipleFeaureService = (
  feats: number[]
): Result<FeatureRunResult> => {
  const res = handleError(() => setUnfocus(feats));
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };
  return res;
};

export const markFeatureAsDoneService = (
  featId: string
): Result<FeatureRunResult> => {
  const idRes = ensureValidId(featId);
  if (idRes instanceof Error) return { success: false, error: idRes };

  const res = handleError(() => setStatusDone(idRes));
  if (!res.success) return { success: false, error: res.error };

  return res;
};
