export type TaskRunResult = {
  changes: number;
  lastInsertRowid: number | bigint;
};

export type Task = {
  id: number;
  feature_id: number;
  description: string;
  status: "todo" | "in_progress" | "done";
  created_at: string;
};
