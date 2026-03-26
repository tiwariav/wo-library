import sharedConfig from "@wo-library/eslint-config";
import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const tsconfigRootDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig([
  ...sharedConfig,
  {
    ignores: [
      "reports",
      "packages/postcss-config/index.d.ts",
      "packages/storybook/.storybook/**",
    ],
  },
  {
    files: ["**/*.ts?(x)"],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.eslint.json"],
        tsconfigRootDir: tsconfigRootDirectory,
      },
    },
  },
  {
    files: [
      ".stylelintrc.js",
      "packages/semantic-release-config/**/*.js",
      "packages/storybook/postcss.config.js",
      "eslint.config.mjs",
    ],
    rules: {
      "compat/compat": "off",
      "unicorn/prefer-module": "off",
    },
  },
]);
