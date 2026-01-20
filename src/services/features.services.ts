import { handleError } from "../utils/handleError.js";
import { getActiveProject } from "../db/queries/projects.js";
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
} from "../db/queries/features.js";
import type { Projects, Result } from "../types/Projects.js";
import type { Feature, FeatureRunResult } from "../types/Features.js";
import { validateFeatureDescription } from "../utils/validateFeatDescription.js";
import { ensureValidId } from "../utils/ensureValidId.js";
import { activeprojectExist } from "../utils/activeProjectExists.js";

export const checkActiveProjectExistService = (): Result<Projects> => {
  const activeProject = handleError(() => getActiveProject());
  if (!activeProject.success)
    return { success: false, error: new Error(activeProject.error.message) };

  const projectData = activeProject.data;
  if (!projectData)
    return { success: false, error: new Error("No active project found") };

  return { success: true, data: projectData };
};

export const listFeatureService = (featId: string): Result<Feature> => {
  const idRes = ensureValidId(featId);
  if (idRes instanceof Error) return { success: false, error: idRes };

  const projectId = activeprojectExist();
  if (!projectId.success)
    return { success: false, error: new Error(projectId.error.message) };

  const feature = handleError(() => getFeature(idRes, projectId.data.id));
  if (!feature.success)
    return { success: false, error: new Error(feature.error.message) };
  const featureData = feature.data;
  if (!featureData)
    return { success: false, error: new Error("No feature found!") };

  return { success: true, data: featureData };
};

export const listAllFeaturesService = (): Result<Feature[]> => {
  const activeProject = handleError(() => getActiveProject());
  if (!activeProject.success)
    return { success: false, error: new Error(activeProject.error.message) };

  const projectData = activeProject.data;
  if (!projectData)
    return { success: false, error: new Error("No active project found") };

  const res = handleError(() => getAllFeatures(projectData.id));
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };

  return res;
};

export const addFeatureService = (
  description: string,
): Result<FeatureRunResult> => {
  const desc = description.trim();
  const error = validateFeatureDescription(desc);

  if (error) return { success: false, error };

  const projectId = activeprojectExist();
  if (!projectId.success)
    return { success: false, error: new Error(projectId.error.message) };

  const res = handleError(() => insertFeature(description, projectId.data.id));
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };

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
  if (!projectId.success)
    return { success: false, error: new Error(projectId.error.message) };

  const res = handleError(() => batchInsert(description, projectId.data.id));
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };
  return res;
};

export const focusFeatureService = (
  featId: string,
): Result<FeatureRunResult> => {
  const idRes = ensureValidId(featId);
  if (idRes instanceof Error) return { success: false, error: idRes };

  const projectId = activeprojectExist();
  if (!projectId.success)
    return { success: false, error: new Error(projectId.error.message) };

  const res = handleError(() => setFocus(idRes, projectId.data.id));
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };
  if (!res.data.changes)
    return {
      success: false,
      error: new Error(`No feature found with id ${featId}`),
    };
  return res;
};

export const getUnfocusedFeatures = (): Result<Feature[]> => {
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

export const focusMultipleFeaturesService = (
  feats: number[],
): Result<FeatureRunResult> => {
  const res = handleError(() => setMultipleFocus(feats));
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };
  return res;
};

export const getFocusedFeatures = (): Result<Feature[]> => {
  const activeProject = handleError(() => getActiveProject());
  if (!activeProject.success)
    return { success: false, error: new Error(activeProject.error.message) };

  const projectData = activeProject.data;
  if (!projectData)
    return { success: false, error: new Error("No active project found") };

  const res = handleError(() => getAllFocusedFeatures(projectData.id));
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };

  return res;
};

export const unfocusMultipleFeaturesService = (
  feats: number[],
): Result<FeatureRunResult> => {
  const res = handleError(() => setUnfocus(feats));
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };
  return res;
};

export const markFeatureAsDoneService = (
  featId: string,
): Result<FeatureRunResult> => {
  const idRes = ensureValidId(featId);
  if (idRes instanceof Error) return { success: false, error: idRes };

  const projectId = activeprojectExist();
  if (!projectId.success)
    return { success: false, error: new Error(projectId.error.message) };

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
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };
  return res;
};

export const addNotesService = (
  notes: string,
  featId: string,
): Result<FeatureRunResult> => {
  const idRes = ensureValidId(featId);
  if (idRes instanceof Error) return { success: false, error: idRes };

  const projectId = activeprojectExist();
  if (!projectId.success)
    return { success: false, error: new Error(projectId.error.message) };

  const res = handleError(() => insertNotes(notes, idRes, projectId.data.id));
  if (!res.success)
    return { success: false, error: new Error(res.error.message) };
  if (!res.data.changes)
    return {
      success: false,
      error: new Error(`No feature found with id ${featId}`),
    };
  return res;
};
