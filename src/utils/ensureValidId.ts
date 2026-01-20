export const ensureValidId = (projectId: string | number): number | Error => {
  if (typeof projectId === "number") return projectId;

  const id = Number(projectId);
  if (isNaN(id) || id <= 0) return new Error("Invalid id");

  return id;
};
