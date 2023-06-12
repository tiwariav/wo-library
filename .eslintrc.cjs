/* eslint-disable unicorn/prefer-module */
const pkg = require("./src/tools/cjs/eslint.cjs");
const { config: sharedConfig } = pkg;

sharedConfig.overrides[0].parserOptions = {
  project: ["./tsconfig.json"],
  tsconfigRootDir: __dirname,
};
module.exports = sharedConfig;
