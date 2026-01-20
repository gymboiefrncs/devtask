import { db } from "../database.js";
import type { ProjectRunResult, Projects } from "../../types/Projects.js";

// look up for optimization
const stmts = {
  getProject: db.prepare<[number], Projects>(
    "SELECT * FROM projects WHERE id = ? LIMIT 1",
  ),
  getActive: db.prepare<[], Projects>(
    "SELECT * FROM projects WHERE status = ? LIMIT 1",
  ),
  getAll: db.prepare<[], Projects>("SELECT * FROM projects"),
  add: db.prepare<[string, string], Projects>(
    "INSERT INTO projects (name, status) VALUES (?, ?) RETURNING *",
  ),
  setAllInactive: db.prepare<[], ProjectRunResult>(
    "UPDATE projects SET status = 'inactive' WHERE status = 'active'",
  ),
  setStatus: db.prepare<[string, number], Projects>(
    "UPDATE projects SET status = ? WHERE id = ? RETURNING *",
  ),
  updateName: db.prepare<[string, number], ProjectRunResult>(
    "UPDATE projects SET name = ? WHERE id = ?",
  ),
  delete: db.prepare<[number], ProjectRunResult>(
    "DELETE FROM projects WHERE id = ?",
  ),
  updateStatus: db.prepare<[string, number], ProjectRunResult>(
    "UPDATE projects SET status = ? WHERE id = ?",
  ),
};

// ==============
// GET QUERIES
// ==============
export const getProject = (projectId: number): Projects | undefined =>
  stmts.getProject.get(projectId);

export const getActiveProject = (): Projects | undefined => {
  const activeProject = stmts.getActive.get();
  return activeProject;
};

export const getAllProjects = (): Projects[] => stmts.getAll.all();

// ============
// ADD QUERY
// ============
export const addProject = (projectName: string): Projects => {
  const active = getActiveProject();
  const initial = active ? "inactive" : "active";
  console.log("Params:", { projectName, initial });
  return stmts.add.get(projectName, initial)!;
};

// ===============
// UPDATE QUERIES
// ================
const performSwitch = db.transaction((id: number) => {
  stmts.setAllInactive.run();
  return stmts.setStatus.get("active", id);
});

export const setActiveProject = (projectId: number): Projects =>
  performSwitch(projectId)!;

export const updateProject = (
  status: "done" | "active",
  projectId: number,
): ProjectRunResult => stmts.updateStatus.run(status, projectId);

export const updateProjectName = (
  projectName: string,
  projectId: number,
): ProjectRunResult => stmts.updateName.run(projectName, projectId);

// ==============
// DELETE QUERY
// ==============
export const deleteProject = (projectId: number): ProjectRunResult =>
  stmts.delete.run(projectId);
