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

// ==============
// GET SERVICES
// ==============
export const listFeatureService = (featId: string): Result<Feature> => {
  const validatedId: number | Error = ensureValidId(featId);
  if (validatedId instanceof Error)
    return { success: false, error: validatedId };

  const activeProject = activeprojectExist();
  if (!activeProject.success)
    return { success: false, error: activeProject.error };

  const result = handleError(() =>
    getFeature(validatedId, activeProject.data.id),
  );

  if (!result.success) return { success: false, error: result.error };
  if (!result.data)
    return { success: false, error: new Error("No feature found!") };

  return { success: true, data: result.data };
};

export const listAllFeaturesService = (): Result<Feature[]> => {
  const activeProject = activeprojectExist();
  if (!activeProject.success)
    return { success: false, error: activeProject.error };

  const result = handleError(() => getAllFeatures(activeProject.data.id));
  if (!result.success) return { success: false, error: result.error };

  return result;
};

export const getUnfocusedFeaturesService = (): Result<Feature[]> => {
  const activeProject = activeprojectExist();
  if (!activeProject.success)
    return { success: false, error: activeProject.error };

  const result = handleError(() =>
    getAllUnfocusedFeatures(activeProject.data.id),
  );
  if (!result.success) return { success: false, error: result.error };

  return result;
};

export const getFocusedFeaturesService = (): Result<Feature[]> => {
  const activeProject = activeprojectExist();
  if (!activeProject.success)
    return { success: false, error: activeProject.error };

  const result = handleError(() =>
    getAllFocusedFeatures(activeProject.data.id),
  );
  if (!result.success) return { success: false, error: result.error };

  return result;
};

// ================
// INSERT SERVICES
// ================
export const addFeatureService = (
  description: string,
): Result<FeatureRunResult> => {
  const validDescription: Error | string =
    validateFeatureDescription(description);
  if (validDescription instanceof Error)
    return { success: false, error: validDescription };

  const activeProject = activeprojectExist();
  if (!activeProject.success)
    return { success: false, error: activeProject.error };

  const result = handleError(() =>
    insertFeature(validDescription, activeProject.data.id),
  );
  if (!result.success) return { success: false, error: result.error };

  return result;
};

export const addMultipleFeatureService = (
  description: string[],
): Result<FeatureRunResult> => {
  const sanitized: string[] = [];

  for (const raw of description) {
    const validDescription: Error | string = validateFeatureDescription(raw);
    if (validDescription instanceof Error)
      return { success: false, error: validDescription };
    sanitized.push(validDescription);
  }

  if (!sanitized.length)
    return { success: false, error: new Error("No features added") };

  const activeProject = activeprojectExist();
  if (!activeProject.success)
    return { success: false, error: activeProject.error };

  const result = handleError(() =>
    batchInsert(sanitized, activeProject.data.id),
  );
  if (!result.success) return { success: false, error: result.error };

  return result;
};

export const addNotesService = (
  notes: string,
  featId: string,
): Result<FeatureRunResult> => {
  const validatedId: number | Error = ensureValidId(featId);
  if (validatedId instanceof Error)
    return { success: false, error: validatedId };

  const validDescription: Error | string = validateFeatureDescription(notes);
  if (validDescription instanceof Error)
    return { success: false, error: new Error("Note cannot be empty") };

  const activeProject = activeprojectExist();
  if (!activeProject.success)
    return { success: false, error: activeProject.error };

  const result = handleError(() =>
    insertNotes(notes, validatedId, activeProject.data.id),
  );
  if (!result.success) return { success: false, error: result.error };

  if (!result.data.changes)
    return {
      success: false,
      error: new Error(`No feature found with id ${featId}`),
    };
  return result;
};

// ================
// UPDATE SERVICES
// ================
export const focusFeatureService = (
  featId: string,
): Result<FeatureRunResult> => {
  const validatedId: number | Error = ensureValidId(featId);
  if (validatedId instanceof Error)
    return { success: false, error: validatedId };

  const activeProject = activeprojectExist();
  if (!activeProject.success)
    return { success: false, error: activeProject.error };

  const result = handleError(() =>
    setFocus(validatedId, activeProject.data.id),
  );

  if (!result.success) return { success: false, error: result.error };
  if (!result.data.changes)
    return {
      success: false,
      error: new Error(`No feature found with id ${featId}`),
    };

  return result;
};

export const focusMultipleFeaturesService = (
  featIds: number[],
): Result<FeatureRunResult> => {
  const result = handleError(() => setMultipleFocus(featIds));
  if (!result.success) return { success: false, error: result.error };

  return result;
};

export const unfocusMultipleFeaturesService = (
  featIds: number[],
): Result<FeatureRunResult> => {
  const result = handleError(() => setUnfocus(featIds));
  if (!result.success) return { success: false, error: result.error };

  return result;
};

export const markFeatureAsDoneService = (
  featId: string,
): Result<FeatureRunResult> => {
  const validatedId: number | Error = ensureValidId(featId);
  if (validatedId instanceof Error)
    return { success: false, error: validatedId };

  const activeProject = activeprojectExist();
  if (!activeProject.success)
    return { success: false, error: activeProject.error };

  const result = handleError(() =>
    setStatusDone(validatedId, activeProject.data.id),
  );

  if (!result.success) return { success: false, error: result.error };
  if (!result.data.changes)
    return {
      success: false,
      error: new Error(`No feature found with id ${featId}`),
    };

  return result;
};

export const updateDescriptionService = (
  description: string,
  featId: string,
) => {
  const validatedId: number | Error = ensureValidId(featId);
  if (validatedId instanceof Error)
    return { success: false, error: validatedId };

  const validDescription: Error | string =
    validateFeatureDescription(description);
  if (validDescription instanceof Error)
    return { success: false, error: validDescription };
  console.log(validDescription);

  const activeProject = activeprojectExist();
  if (!activeProject.success)
    return { success: false, error: activeProject.error };
  const result = handleError(() =>
    updateDescription(validDescription, validatedId, activeProject.data.id),
  );

  if (!result.success) return { success: false, error: result.error };
  if (!result.data.changes)
    return {
      success: false,
      error: new Error(`No feature found with id ${featId}`),
    };
  return result;
};

// ===============
// DELETE SERVICE
// ===============
export const removeFeatureService = (
  featIds: number[],
): Result<FeatureRunResult> => {
  const result = handleError(() => deleteFeat(featIds));
  if (!result.success) return { success: false, error: result.error };
  return result;
};
