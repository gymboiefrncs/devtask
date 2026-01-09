import { db } from "../database.js";
import type { Projects, RunProjectResult } from "../../types/Projects.js";
import type { RunResult } from "better-sqlite3";

const getProject = (projectId: number): Projects | undefined => {
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

export const addProject = (projectName: string): RunProjectResult => {
  const active = getActiveProject();
  const initial = active ? "inactive" : "active";
  const result = db
    .prepare<[string, string], RunResult>(
      "INSERT INTO projects (name, status) VALUES (?, ?)"
    )
    .run(projectName, initial);

  return { changes: result.changes, lastInsertRowId: result.lastInsertRowid };
};

export const setActiveProject = (projectId: number): Projects => {
  const setInactive = db.prepare("UPDATE projects SET status = 'inactive'");

  const setActive = db.prepare<[string, number], Projects>(
    "UPDATE projects SET status = ? WHERE id = ? RETURNING *"
  );

  const exists = getProject(projectId);
  if (!exists) throw new Error(`Project with id=${projectId} does not exist`);

  const performSwitch = db.transaction((id: number) => {
    setInactive.run();
    const result = setActive.get("active", id);
    if (!result) throw new Error(`Failed to switch projects to id=${id}`);
    return result;
  });

  return performSwitch(projectId);
};
