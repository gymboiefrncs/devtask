import { ValidationError } from "./handleError.js";

export const ensureValidId = (
  id: string | number,
): number | ValidationError => {
  if (!id) return new ValidationError("Id is required");
  if (typeof id === "number") return id;

  const idNum = Number(id);
  if (isNaN(idNum) || idNum <= 0) return new ValidationError("Invalid ID");

  return idNum;
};
