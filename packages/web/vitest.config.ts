import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: [
        "src/index.ts",
        "src/tools/index.ts",
        "src/tools/clipboard.ts",
        "src/tools/css.ts",
        "src/tools/loadStylesheet.ts",
        "src/tools/svg.ts",
        "src/tools/uploadFile.ts",
        "src/tools/error/index.ts",
        "src/tools/others/index.ts",
      ],
      provider: "v8",
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
    environment: "jsdom",
    globals: true,
    include: ["src/**/__tests__/**/*.test.ts"],
  },
});
