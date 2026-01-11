export const ensureValidId = (projectId: string): number | Error => {
  const id = Number(projectId);
  if (isNaN(id) || id <= 0) return new Error("Invalid project id");

  return id;
};
