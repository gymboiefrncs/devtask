export type Feature = {
  id: number;
  project_id: number;
  description: string;
  status: "todo" | "in_progress" | "done";
  created_at: string;
  finished_at: string;
  time_spent: number;
  notes: string;
  is_focused: number;
};

export type FeatureRunResult = {
  changes: number;
  lastInsertRowid: number | bigint;
};
