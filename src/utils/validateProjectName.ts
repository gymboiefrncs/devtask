import { ValidationError } from "./handleError.js";

export const validateProjectName = (
  rawName: string,
): ValidationError | string => {
  const name = rawName ? rawName.trim() : "";
  const invalidChar: RegExp = /[^a-zA-Z0-9\s\-_]/;

  // handle edge cases
  if (!name) return new ValidationError("Project name cannot be empty");
  if (invalidChar.test(name))
    return new ValidationError("Invalid project name");
  if (name.length > 50) return new ValidationError("Project name too long");

  return name;
};
