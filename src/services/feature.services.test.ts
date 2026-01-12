import { describe, it, expect } from "vitest";
import { validateFeatureDescription } from "../utils/validateFeatDescription.js";
describe("validateFeatureDescription", () => {
  it("rejects if description is empty", () => {
    expect(validateFeatureDescription("")).toEqual(
      expect.objectContaining({ message: "Description cannot be empty" })
    );
  });

  it("rejects if description is too long", () => {
    const name = "sample".repeat(40);
    expect(validateFeatureDescription(name)).toEqual(
      expect.objectContaining({ message: "Description too long" })
    );
  });

  it("rejects if description contains invalid characters", () => {
    expect(validateFeatureDescription("]+=*")).toEqual(
      expect.objectContaining({ message: "Invalid description" })
    );
  });

  it("accepts valid description", () => {
    expect(validateFeatureDescription("new project")).toBeNull();
  });
});
