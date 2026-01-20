export const validateFeatureDescription = (desc: string): Error | string => {
  const invalidChar: RegExp = /[^a-zA-Z0-9\s\-_.,?!:;()'"&]/;

  // handle edge cases
  if (!desc) return new Error("Description cannot be empty");
  if (invalidChar.test(desc)) return new Error("Invalid description");
  if (desc.length > 70) return new Error("Description too long");

  return desc.trim();
};
