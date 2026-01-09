type Result<T> = [T, null] | [null, Error];

export const handleError = <T>(cb: () => T): Result<T> => {
  try {
    const result = cb();
    return [result, null];
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    return [null, err];
  }
};
