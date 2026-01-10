import { db } from "../database.js";
import type { Projects } from "../../types/Projects.js";

export const getProject = (projectId: number): Projects | undefined => {
  return db
    .prepare<[number], Projects>("SELECT * FROM projects WHERE id = ? LIMIT 1")
    .get(projectId);
};

export const getActiveProject = (): Projects | undefined => {
  const activeProject = db
    .prepare<[], Projects>(
      "SELECT * FROM projects WHERE status = 'active' LIMIT 1"
    )
    .get();
  return activeProject;
};

export const getAllProjects = (): Projects[] => {
  return db.prepare<[], Projects>("SELECT * FROM projects").all();
};

export const addProject = (projectName: string): Projects => {
  const active = getActiveProject();
  const initial = active ? "inactive" : "active";
  const result = db
    .prepare<[string, string], Projects>(
      "INSERT INTO projects (name, status) VALUES (?, ?) RETURNING *"
    )
    .get(projectName, initial);

  return result!;
};

export const setActiveProject = (projectId: number): Projects => {
  const setInactive = db.prepare(
    "UPDATE projects SET status = 'inactive' WHERE status = 'active'"
  );

  const setActive = db.prepare<[string, number], Projects>(
    "UPDATE projects SET status = ? WHERE id = ? RETURNING *"
  );

  const performSwitch = db.transaction((id: number) => {
    setInactive.run();
    const result = setActive.get("active", id);
    return result;
  });

  return performSwitch(projectId)!;
};

export const addThenSwitch = (projectId: number): Projects => {
  return setActiveProject(projectId);
};
