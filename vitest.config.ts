import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Enables global 'describe', 'it', 'expect' (optional)
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
