import { handleError } from "../utils/handleError.js";
import {
  batchInsert,
  getAllFeatures,
  getAllUnfocusedFeatures,
  getFeature,
  insertFeature,
  setFocus,
  setMultipleFocus,
  getAllFocusedFeatures,
  setUnfocus,
  setStatusDone,
  deleteFeat,
  insertNotes,
  updateDescription,
} from "../db/queries/features.js";
import type { Result } from "../types/Projects.js";
import type { Feature, FeatureRunResult } from "../types/Features.js";
import { validateFeatureDescription } from "../utils/validateFeatDescription.js";
import { ensureValidId } from "../utils/ensureValidId.js";
import { activeprojectExist } from "../utils/activeProjectExists.js";

export const listFeatureService = (featId: string): Result<Feature> => {
  const idRes = ensureValidId(featId);
  if (idRes instanceof Error) return { success: false, error: idRes };

  const projectId = activeprojectExist();
  if (!projectId.success) return { success: false, error: projectId.error };

  const feature = handleError(() => getFeature(idRes, projectId.data.id));
  if (!feature.success) return { success: false, error: feature.error };
  const featureData = feature.data;
  if (!featureData)
    return { success: false, error: new Error("No feature found!") };

  return { success: true, data: featureData };
};

export const listAllFeaturesService = (): Result<Feature[]> => {
  const projectId = activeprojectExist();
  if (!projectId.success) return { success: false, error: projectId.error };

  const res = handleError(() => getAllFeatures(projectId.data.id));
  if (!res.success) return { success: false, error: res.error };

  return res;
};

export const addFeatureService = (
  description: string,
): Result<FeatureRunResult> => {
  const desc = description.trim();
  const error = validateFeatureDescription(desc);

  if (error) return { success: false, error };

  const projectId = activeprojectExist();
  if (!projectId.success) return { success: false, error: projectId.error };

  const res = handleError(() => insertFeature(description, projectId.data.id));
  if (!res.success) return { success: false, error: res.error };

  return res;
};

export const addMultipleFeatureService = (
  description: string[],
): Result<FeatureRunResult> => {
  for (const desc of description) {
    const error = validateFeatureDescription(desc.trim());
    if (error) return { success: false, error };
  }

  const projectId = activeprojectExist();
  if (!projectId.success) return { success: false, error: projectId.error };

  const res = handleError(() => batchInsert(description, projectId.data.id));
  if (!res.success) return { success: false, error: res.error };
  return res;
};

export const focusFeatureService = (
  featId: string,
): Result<FeatureRunResult> => {
  const idRes = ensureValidId(featId);
  if (idRes instanceof Error) return { success: false, error: idRes };

  const projectId = activeprojectExist();
  if (!projectId.success) return { success: false, error: projectId.error };

  const res = handleError(() => setFocus(idRes, projectId.data.id));
  if (!res.success) return { success: false, error: res.error };
  if (!res.data.changes)
    return {
      success: false,
      error: new Error(`No feature found with id ${featId}`),
    };
  return res;
};

export const getUnfocusedFeatures = (): Result<Feature[]> => {
  const projectId = activeprojectExist();
  if (!projectId.success) return { success: false, error: projectId.error };

  const res = handleError(() => getAllUnfocusedFeatures(projectId.data.id));
  if (!res.success) return { success: false, error: res.error };

  return res;
};

export const focusMultipleFeaturesService = (
  feats: number[],
): Result<FeatureRunResult> => {
  const res = handleError(() => setMultipleFocus(feats));
  if (!res.success) return { success: false, error: res.error };
  return res;
};

export const getFocusedFeatures = (): Result<Feature[]> => {
  const projectId = activeprojectExist();
  if (!projectId.success) return { success: false, error: projectId.error };

  const res = handleError(() => getAllFocusedFeatures(projectId.data.id));
  if (!res.success) return { success: false, error: res.error };

  return res;
};

export const unfocusMultipleFeaturesService = (
  feats: number[],
): Result<FeatureRunResult> => {
  const res = handleError(() => setUnfocus(feats));
  if (!res.success) return { success: false, error: res.error };
  return res;
};

export const markFeatureAsDoneService = (
  featId: string,
): Result<FeatureRunResult> => {
  const idRes = ensureValidId(featId);
  if (idRes instanceof Error) return { success: false, error: idRes };

  const projectId = activeprojectExist();
  if (!projectId.success) return { success: false, error: projectId.error };

  const res = handleError(() => setStatusDone(idRes, projectId.data.id));
  if (!res.success) return { success: false, error: res.error };
  if (!res.data.changes)
    return {
      success: false,
      error: new Error(`No feature found with id ${featId}`),
    };
  return res;
};

export const removeFeatureService = (
  feats: number[],
): Result<FeatureRunResult> => {
  const res = handleError(() => deleteFeat(feats));
  if (!res.success) return { success: false, error: res.error };
  return res;
};

export const addNotesService = (
  notes: string,
  featId: string,
): Result<FeatureRunResult> => {
  const idRes = ensureValidId(featId);
  if (idRes instanceof Error) return { success: false, error: idRes };

  const projectId = activeprojectExist();
  if (!projectId.success) return { success: false, error: projectId.error };

  const res = handleError(() => insertNotes(notes, idRes, projectId.data.id));
  if (!res.success) return { success: false, error: res.error };
  if (!res.data.changes)
    return {
      success: false,
      error: new Error(`No feature found with id ${featId}`),
    };
  return res;
};

export const updateDescriptionService = (
  description: string,
  featId: string,
) => {
  const idRes = ensureValidId(featId);
  if (idRes instanceof Error) return { success: false, error: idRes };

  const projectId = activeprojectExist();
  if (!projectId.success) return { success: false, error: projectId.error };

  const res = handleError(() =>
    updateDescription(description, idRes, projectId.data.id),
  );
  if (!res.success) return { success: false, error: res.error };
  if (!res.data.changes)
    return {
      success: false,
      error: new Error(`No feature found with id ${featId}`),
    };
  return res;
};
