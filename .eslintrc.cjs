/* eslint-disable unicorn/prefer-module */
const eslintConfig = require("./src/tools/cjs/eslint.cjs");
const { config: sharedConfig } = eslintConfig;

sharedConfig.overrides[0].parserOptions = {
  project: ["./tsconfig.json"],
  tsconfigRootDir: __dirname,
};
module.exports = sharedConfig;
