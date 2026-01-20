export const ensureValidId = (id: string | number): number | Error => {
  if (!id) return new Error("Id is required");
  if (typeof id === "number") return id;

  const idNum = Number(id);
  if (isNaN(idNum) || idNum <= 0) return new Error("Invalid id");

  return idNum;
};
