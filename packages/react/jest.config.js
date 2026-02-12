import woJestConfig from "wo-library/tools/cjs/jest/config.cjs";

const { config: sharedConfig } = woJestConfig;
const TRANSFORM_MODULES = ["default-import", "lodash-es"];

const config = {
  ...sharedConfig,
  setupFilesAfterEnv: ["wo-library/tools/cjs/jest/setupTests.cjs"],
  testRegex: "src.*(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  transformIgnorePatterns: [
    `/node_modules/(?!(${TRANSFORM_MODULES.join("|")})/)`,
  ],
};

export default config;
