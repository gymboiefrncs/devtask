export type Projects = {
  id: number;
  name: string;
  status: "active" | "inactive" | "done";
  created_at: string;
};

export type ServiceResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string | Error };

export type RunProjectResult = {
  changes: number;
  lastInsertRowId: number | bigint;
};
