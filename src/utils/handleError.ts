import type { Result } from "../types/Projects.js";

export const handleError = <T>(cb: () => T): Result<T> => {
  try {
    return { success: true, data: cb() };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
};
