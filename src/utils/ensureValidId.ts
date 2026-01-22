import type { Result } from "../types/Projects.js";
import { ValidationError } from "./handleError.js";

const ensureValidId = (id: string | number): number | ValidationError => {
  if (!id) return new ValidationError("Id is required");
  if (typeof id === "number") return id;

  const idNum = Number(id);
  if (isNaN(idNum) || idNum <= 0) return new ValidationError("Invalid ID");

  return idNum;
};

export const validateId = (id: string | number): Result<number> => {
  const validId = ensureValidId(id);
  if (validId instanceof Error) return { ok: false, err: validId };
  return { ok: true, data: validId };
};
