import { defineConfig } from "eslint/config";
import { fileURLToPath } from "node:url";
import sharedConfig from "@wo-library/eslint-config";

const tsconfigRootDirectory = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig([
  ...sharedConfig,
  {
    files: ["**/*.ts?(x)"],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: tsconfigRootDirectory,
      },
    },
  },
]);
