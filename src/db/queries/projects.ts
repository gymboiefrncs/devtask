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

export const setActiveProject = (projectId: number): Projects => {
  const setInactive = db.prepare("UPDATE projects SET status = 'inactive'");

  const setActive = db.prepare<[string, number], Projects>(
    "UPDATE projects SET status = ? WHERE id = ? RETURNING *"
  );

  const performSwitch = db.transaction((id: number) => {
    setInactive.run();
    const result = setActive.get("active", id);
    if (!result) throw new Error("Failed to switch projects");
    return result;
  });

  return performSwitch(projectId);
};
