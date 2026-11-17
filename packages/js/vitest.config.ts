import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        "src/tools/files.js",
        "src/tools/node/**",
        "src/tools/rollup/**",
        "**/__tests__/**",
        "**/*.d.ts",
      ],
      include: ["src/**/*.{ts,tsx}"],
      provider: "v8",
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
    environment: "node",
    globals: true,
    include: ["src/**/__tests__/**/*.test.ts"],
  },
});
