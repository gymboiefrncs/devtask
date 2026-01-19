import { updateProject } from "../db/queries/projects.js";
import type { Feature } from "../types/Features.js";

export const updateProjectStatus = (feats: Feature[]) => {
  const all = feats.every((feat) => feat.status === "done");
  updateProject(all ? "done" : "active", feats[0]!.project_id);
};
