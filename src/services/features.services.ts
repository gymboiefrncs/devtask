import {
  ConflictError,
  DatabaseError,
  handleError,
  NotFoundError,
} from "../utils/handleError.js";
import * as queries from "../db/queries/features.js";
import type { Result } from "../types/Projects.js";
import type { Feature, FeatureRunResult } from "../types/Features.js";
import { validateDescription } from "../utils/validateFeatDescription.js";
import { validateId } from "../utils/ensureValidId.js";
import { requireActiveProject } from "../utils/activeProjectExists.js";

// ==============
// GET SERVICES
// ==============
export const listFeatureService = (featId: string): Result<Feature> => {
  const idCheck = validateId(featId);
  if (!idCheck.ok) return idCheck;

  const projectCheck = requireActiveProject();
  if (!projectCheck.ok) return projectCheck;

  const result = handleError(() =>
    queries.getFeature(idCheck.data, projectCheck.data.id),
  );

  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };
  if (!result.data)
    return { ok: false, err: new NotFoundError("No feature found!") };

  return { ok: true, data: result.data };
};

export const listAllFeaturesService = (): Result<Feature[]> => {
  const projectCheck = requireActiveProject();
  if (!projectCheck.ok) return projectCheck;

  const result = handleError(() =>
    queries.getAllFeatures(projectCheck.data.id),
  );
  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };

  return result;
};

export const getFocusedFeaturesService = (): Result<Feature> => {
  const projectCheck = requireActiveProject();
  if (!projectCheck.ok) return projectCheck;

  const result = handleError(() =>
    queries.getFocusedFeatures(projectCheck.data.id),
  );
  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };
  if (!result.data)
    return { ok: false, err: new NotFoundError("No focused feature") };

  return { ok: true, data: result.data };
};

// ================
// INSERT SERVICES
// ================
export const addFeatureService = (
  description: string,
): Result<FeatureRunResult> => {
  const descCheck = validateDescription(description);
  if (!descCheck.ok) return descCheck;

  const projectCheck = requireActiveProject();
  if (!projectCheck.ok) return projectCheck;

  const result = handleError(() =>
    queries.insertFeature(descCheck.data, projectCheck.data.id),
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
    const descCheck = validateDescription(raw);
    if (!descCheck.ok) return descCheck;
    sanitized.push(descCheck.data);
  }

  if (!sanitized.length)
    return { ok: false, err: new ConflictError("No features added") };

  const projectCheck = requireActiveProject();
  if (!projectCheck.ok) return projectCheck;

  const result = handleError(() =>
    queries.batchInsert(sanitized, projectCheck.data.id),
  );
  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };

  return result;
};

export const addNotesService = (
  notes: string,
  featId: string,
): Result<FeatureRunResult> => {
  const idCheck = validateId(featId);
  if (!idCheck.ok) return idCheck;

  const noteCheck = validateDescription(notes);
  if (!noteCheck.ok) return noteCheck;

  const projectCheck = requireActiveProject();
  if (!projectCheck.ok) return projectCheck;

  const result = handleError(() =>
    queries.insertNotes(noteCheck.data, idCheck.data, projectCheck.data.id),
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
  const projectCheck = requireActiveProject();
  if (!projectCheck.ok) return projectCheck;

  const focused = handleError(() =>
    queries.getFocusedFeatures(projectCheck.data.id),
  );
  if (!focused.ok)
    return { ok: false, err: new DatabaseError(focused.err.message) };
  if (focused.data)
    return {
      ok: false,
      err: new ConflictError("There is already a focused feature"),
    };

  const idCheck = validateId(featId);
  if (!idCheck.ok) return idCheck;

  const result = handleError(() =>
    queries.setFocus(idCheck.data, projectCheck.data.id),
  );

  if (!result.ok) return { ok: false, err: result.err };
  if (!result.data.changes)
    return {
      ok: false,
      err: new NotFoundError(`No feature found with id ${featId}`),
    };

  return result;
};

export const unfocusFeaturesService = (
  featId: number,
): Result<FeatureRunResult> => {
  const result = handleError(() => queries.setUnfocus(featId));
  if (!result.ok)
    return { ok: false, err: new DatabaseError(result.err.message) };

  return result;
};

export const markFeatureAsDoneService = (
  featId: string,
): Result<FeatureRunResult> => {
  const idCheck = validateId(featId);
  if (!idCheck.ok) return idCheck;

  const projectCheck = requireActiveProject();
  if (!projectCheck.ok) return projectCheck;

  const result = handleError(() =>
    queries.setStatusDone(idCheck.data, projectCheck.data.id),
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
  const idCheck = validateId(featId);
  if (!idCheck.ok) return idCheck;

  const descCheck = validateDescription(description);
  if (!descCheck.ok) return descCheck;

  const projectCheck = requireActiveProject();
  if (!projectCheck.ok) return projectCheck;

  const result = handleError(() =>
    queries.updateDescription(
      descCheck.data,
      idCheck.data,
      projectCheck.data.id,
    ),
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
