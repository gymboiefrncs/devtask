import { describe, it, expect } from "vitest";
import { validateProjectName } from "../utils/validateProjectName.js";
import { ensureValidId } from "../utils/ensureValidId.js";

describe("validateProjectName", () => {
  it("rejects if name is empty", () => {
    expect(validateProjectName("")).toEqual(
      expect.objectContaining({ message: "Project name cannot be empty" })
    );
  });

  it("rejects if name is too long", () => {
    const name = "sample".repeat(40);
    expect(validateProjectName(name)).toEqual(
      expect.objectContaining({ message: "Project name too long" })
    );
  });

  it("rejects if name contains invalid characters", () => {
    expect(validateProjectName("]+=*")).toEqual(
      expect.objectContaining({ message: "Invalid project name" })
    );
  });

  it("accepts valid name", () => {
    expect(validateProjectName("new project")).toBeNull();
  });
});

describe("ensureValidId", () => {
  it("rejects if id is invalid", () => {
    expect(ensureValidId("1kk")).toEqual(
      expect.objectContaining({ message: "Invalid project id" })
    );
  });

  it("accepts valid id", () => {
    expect(ensureValidId("1")).toBe(1);
  });
});
