import type { Result } from "../types/Projects.js";

export const handleError = <T>(cb: () => T): Result<T> => {
  try {
    return { ok: true, data: cb() };
  } catch (err) {
    return {
      ok: false,
      err: err instanceof Error ? err : new Error(String(err)),
    };
  }
};

export class CliError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class DatabaseError extends CliError {}
export class ConflictError extends CliError {}
export class NotFoundError extends CliError {}
export class ValidationError extends CliError {}
