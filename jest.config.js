import { config as sharedConfig } from "./src/tools/cjs/jest/config.cjs";

const config = {
  ...sharedConfig,
  setupFilesAfterEnv: ["<rootDir>/src/tools/cjs/jest/setupTests.cjs"],
  testRegex: "src.*(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
};

export default config;
