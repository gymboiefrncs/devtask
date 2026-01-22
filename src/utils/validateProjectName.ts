import type { Result } from "../types/Projects.js";
import { ValidationError } from "./handleError.js";

const validateProjectName = (rawName: string): ValidationError | string => {
  const name = rawName ? rawName.trim() : "";
  const invalidChar: RegExp = /[^a-zA-Z0-9\s\-_]/;

  // handle edge cases
  if (!name) return new ValidationError("Project name cannot be empty");
  if (invalidChar.test(name))
    return new ValidationError("Invalid project name");
  if (name.length > 50) return new ValidationError("Project name too long");

  return name;
};

export const validateName = (name: string): Result<string> => {
  const validated = validateProjectName(name);
  if (validated instanceof Error) return { ok: false, err: validated };
  return { ok: true, data: validated };
};
