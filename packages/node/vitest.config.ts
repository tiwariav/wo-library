import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: ["src/**/__tests__/**", "src/**/*.stories.*"],
      include: ["src/**/*.{ts,tsx}"],
      reporter: ["text", "text-summary"],
      thresholds: {
        branches: 80,
        functions: 100,
        lines: 95,
        statements: 95,
      },
    },
    environment: "node",
    globals: true,
    include: ["src/**/__tests__/**/*.{ts,tsx}"],
  },
});
