import type { ServiceResponse } from "../types/Projects.js";

export const handleError = <T>(cb: () => T): ServiceResponse<T> => {
  try {
    return { success: true, data: cb() };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
};
