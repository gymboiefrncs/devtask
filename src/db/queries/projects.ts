import { db } from "../database.js";
import type { Projects } from "../../types/Projects.js";

const getActiveProject = (): boolean => {
  const activeProject = db
    .prepare<[], { id: number }>(
      "SELECT id FROM projects WHERE status = 'active' LIMIT 1"
    )
    .get();
  return !!activeProject;
};

export const addProject = (projectName: string): Projects => {
  const active = getActiveProject();

  const initilial = active ? "inactive" : "active";
  const result = db
    .prepare<[string, string], Projects>(
      "INSERT INTO projects (name, status) VALUES (?, ?) RETURNING *"
    )
    .get(projectName, initilial);

  if (!result) throw new Error(`Failed to insert project ${projectName}`);

  return result;
};

export const getAllProjects = (): Projects[] => {
  return db.prepare<[], Projects>("SELECT * FROM projects").all();
};
