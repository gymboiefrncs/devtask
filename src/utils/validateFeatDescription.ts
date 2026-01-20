export const validateFeatureDescription = (desc: string): Error | string => {
  const invalidChar: RegExp = /[^a-zA-Z0-9\s\-_.,?!:;()'"&]/;
  const trimmed = desc ? desc.trim() : "";
  // handle edge cases
  if (!trimmed) return new Error("Description cannot be empty");
  if (invalidChar.test(trimmed)) return new Error("Invalid description");
  if (trimmed.length > 70) return new Error("Description too long");

  return trimmed;
};
