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

export const getUnfocusedFeatures = (): Result<Feature[]> => {
  const activeProject = activeprojectExist();
  if (!activeProject.success)
    return { success: false, error: activeProject.error };

  const result = handleError(() =>
    getAllUnfocusedFeatures(activeProject.data.id),
  );
  if (!result.success) return { success: false, error: result.error };

  return result;
};

export const getFocusedFeatures = (): Result<Feature[]> => {
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
  const sanitized = description.trim();

  const validationError: Error | null = validateFeatureDescription(sanitized);
  if (validationError) return { success: false, error: validationError };

  const activeProject = activeprojectExist();
  if (!activeProject.success)
    return { success: false, error: activeProject.error };

  const result = handleError(() =>
    insertFeature(sanitized, activeProject.data.id),
  );
  if (!result.success) return { success: false, error: result.error };

  return result;
};

export const addMultipleFeatureService = (
  description: string[],
): Result<FeatureRunResult> => {
  const sanitized: string[] = [];

  for (const raw of description) {
    const desc = raw.trim();
    const validationError: Error | null = validateFeatureDescription(desc);
    if (validationError) return { success: false, error: validationError };
    sanitized.push(desc);
  }

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

  const activeProject = activeprojectExist();
  if (!activeProject.success)
    return { success: false, error: activeProject.error };

  const result = handleError(() =>
    updateDescription(description, validatedId, activeProject.data.id),
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
