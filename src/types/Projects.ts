export type Projects = {
  id: number;
  name: string;
  status: "active" | "inactive" | "done";
  created_at: string;
};

export type ServiceResponse<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export type ProjectRunResult = {
  changes: number;
  lastInsertRowid: number | bigint;
};
