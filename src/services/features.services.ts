import {
  ConflictError,
  DatabaseError,
  handleError,
  NotFoundError,
  ValidationError,
} from "../utils/handleError.js";
import * as queries from "../db/queries/features.js";
import type { Result } from "../types/Projects.js";
import type { Feature, FeatureRunResult } from "../types/Features.js";
import { validateFeatureDescription } from "../utils/validateFeatDescription.js";
import { ensureValidId } from "../utils/ensureValidId.js";
import { activeprojectExist } from "../utils/activeProjectExists.js";

// ==============
// GET SERVICES
// ==============
export const listFeatureService = (featId: string): Result<Feature> => {
  const validId: number | ValidationError = ensureValidId(featId);
  if (validId instanceof ValidationError) return { ok: false, err: validId };

  const activeProject = activeprojectExist();
  if (!activeProject.ok)
    return { ok: false, err: new DatabaseError(activeProject.err.message) };
  if (!activeProject.data)
    return {
      ok: false,
      err: new NotFoundError("No active project. Please create one first"),
    };

  const result = handleError(() =>
    queries.getFeature(validId, activeProject.data.id),
  );

  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };
  if (!result.data)
    return { ok: false, err: new NotFoundError("No feature found!") };

  return { ok: true, data: result.data };
};

export const listAllFeaturesService = (): Result<Feature[]> => {
  const activeProject = activeprojectExist();
  if (!activeProject.ok)
    return { ok: false, err: new DatabaseError(activeProject.err.message) };
  if (!activeProject.data)
    return {
      ok: false,
      err: new NotFoundError("No active project. Please create one first"),
    };

  const result = handleError(() =>
    queries.getAllFeatures(activeProject.data.id),
  );
  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };

  return result;
};

export const getUnfocusedFeaturesService = (): Result<Feature[]> => {
  const activeProject = activeprojectExist();
  if (!activeProject.ok)
    return { ok: false, err: new DatabaseError(activeProject.err.message) };
  if (!activeProject.data)
    return {
      ok: false,
      err: new NotFoundError("No active project. Please create one first"),
    };

  const result = handleError(() =>
    queries.getAllUnfocusedFeatures(activeProject.data.id),
  );
  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };

  return result;
};

export const getFocusedFeaturesService = (): Result<Feature[]> => {
  const activeProject = activeprojectExist();
  if (!activeProject.ok)
    return { ok: false, err: new DatabaseError(activeProject.err.message) };
  if (!activeProject.data)
    return {
      ok: false,
      err: new NotFoundError("No active project. Please create one first"),
    };

  const result = handleError(() =>
    queries.getAllFocusedFeatures(activeProject.data.id),
  );
  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };

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
    return { ok: false, err: validDescription };

  const activeProject = activeprojectExist();
  if (!activeProject.ok)
    return { ok: false, err: new DatabaseError(activeProject.err.message) };
  if (!activeProject.data)
    return {
      ok: false,
      err: new NotFoundError("No active project. Please create one first"),
    };

  const result = handleError(() =>
    queries.insertFeature(validDescription, activeProject.data.id),
  );
  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };

  return result;
};

export const addMultipleFeatureService = (
  description: string[],
): Result<FeatureRunResult> => {
  const sanitized: string[] = [];

  for (const raw of description) {
    const validDescription: ValidationError | string =
      validateFeatureDescription(raw);
    if (validDescription instanceof ValidationError)
      return { ok: false, err: validDescription };
    sanitized.push(validDescription);
  }

  if (!sanitized.length)
    return { ok: false, err: new ConflictError("No features added") };

  const activeProject = activeprojectExist();
  if (!activeProject.ok)
    return { ok: false, err: new DatabaseError(activeProject.err.message) };
  if (!activeProject.data)
    return {
      ok: false,
      err: new NotFoundError("No active project. Please create one first"),
    };

  const result = handleError(() =>
    queries.batchInsert(sanitized, activeProject.data.id),
  );
  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };

  return result;
};

export const addNotesService = (
  notes: string,
  featId: string,
): Result<FeatureRunResult> => {
  const validId: number | ValidationError = ensureValidId(featId);
  if (validId instanceof ValidationError) return { ok: false, err: validId };

  const validDescription: ValidationError | string =
    validateFeatureDescription(notes);
  if (validDescription instanceof Error)
    return { ok: false, err: new ConflictError("Note cannot be empty") };

  const activeProject = activeprojectExist();
  if (!activeProject.ok)
    return { ok: false, err: new DatabaseError(activeProject.err.message) };
  if (!activeProject.data)
    return {
      ok: false,
      err: new NotFoundError("No active project. Please create one first"),
    };

  const result = handleError(() =>
    queries.insertNotes(notes, validId, activeProject.data.id),
  );
  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };

  if (!result.data.changes)
    return {
      ok: false,
      err: new NotFoundError(`No feature found with id ${featId}`),
    };
  return result;
};

// ================
// UPDATE SERVICES
// ================
export const focusFeatureService = (
  featId: string,
): Result<FeatureRunResult> => {
  const validId: number | Error = ensureValidId(featId);
  if (validId instanceof Error) return { ok: false, err: validId };

  const activeProject = activeprojectExist();
  if (!activeProject.ok)
    return { ok: false, err: new DatabaseError(activeProject.err.message) };
  if (!activeProject.data)
    return {
      ok: false,
      err: new NotFoundError("No active project. Please create one first"),
    };

  const result = handleError(() =>
    queries.setFocus(validId, activeProject.data.id),
  );

  if (!result.ok) return { ok: false, err: result.err };
  if (!result.data.changes)
    return {
      ok: false,
      err: new NotFoundError(`No feature found with id ${featId}`),
    };

  return result;
};

export const focusMultipleFeaturesService = (
  featIds: number[],
): Result<FeatureRunResult> => {
  const result = handleError(() => queries.setMultipleFocus(featIds));
  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };

  return result;
};

export const unfocusMultipleFeaturesService = (
  featIds: number[],
): Result<FeatureRunResult> => {
  const result = handleError(() => queries.setUnfocus(featIds));
  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };

  return result;
};

export const markFeatureAsDoneService = (
  featId: string,
): Result<FeatureRunResult> => {
  const validId: number | ValidationError = ensureValidId(featId);
  if (validId instanceof ValidationError) return { ok: false, err: validId };

  const activeProject = activeprojectExist();
  if (!activeProject.ok)
    return { ok: false, err: new DatabaseError(activeProject.err.message) };
  if (!activeProject.data)
    return {
      ok: false,
      err: new NotFoundError("No active project. Please create one first"),
    };

  const result = handleError(() =>
    queries.setStatusDone(validId, activeProject.data.id),
  );

  if (!result.ok) return { ok: false, err: result.err };
  if (!result.data.changes)
    return {
      ok: false,
      err: new NotFoundError(`No feature found with id ${featId}`),
    };

  return result;
};

export const updateDescriptionService = (
  description: string,
  featId: string,
) => {
  const validId: number | ValidationError = ensureValidId(featId);
  if (validId instanceof ValidationError) return { ok: false, err: validId };

  const validDescription: ValidationError | string =
    validateFeatureDescription(description);
  if (validDescription instanceof ValidationError)
    return { ok: false, err: validDescription };

  const activeProject = activeprojectExist();
  if (!activeProject.ok)
    return { ok: false, err: new DatabaseError(activeProject.err.message) };
  if (!activeProject.data)
    return {
      ok: false,
      err: new NotFoundError("No active project. Please create one first"),
    };

  const result = handleError(() =>
    queries.updateDescription(validDescription, validId, activeProject.data.id),
  );

  if (!result.ok) return { ok: false, err: result.err };
  if (!result.data.changes)
    return {
      ok: false,
      err: new NotFoundError(`No feature found with id ${featId}`),
    };
  return result;
};

// ===============
// DELETE SERVICE
// ===============
export const removeFeatureService = (
  featIds: number[],
): Result<FeatureRunResult> => {
  const result = handleError(() => queries.deleteFeat(featIds));
  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };
  return result;
};
