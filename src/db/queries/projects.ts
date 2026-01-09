import { db } from "../database.js";

export const addProject = (projectName: string) => {
  const result = db
    .prepare("INSERT INTO projects (name) VALUES (?) RETURNING *")
    .get(projectName);

  return result;
};
