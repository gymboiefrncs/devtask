import type {
  ConflictError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "../utils/handleError.js";

export type Projects = {
  id: number;
  name: string;
  status: "active" | "inactive" | "done";
  created_at: string;
};

export type Result<T, E = CustomErrors> =
  | { ok: true; data: T }
  | { ok: false; err: E };

export type ProjectRunResult = {
  changes: number;
  lastInsertRowid: number | bigint;
};

export type CustomErrors =
  | ValidationError
  | DatabaseError
  | ConflictError
  | NotFoundError;
