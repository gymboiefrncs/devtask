export const validateProjectName = (name: string): Error | null => {
  const invalidChar: RegExp = /[^a-zA-Z0-9\s\-_]/;

  // handle edge cases
  if (!name) return new Error("Project name cannot be empty");
  if (invalidChar.test(name)) return new Error("Invalid project name");
  if (name.length > 50) return new Error("Project name too long");

  return null;
};
