import { config as sharedConfig } from "./src/tools/cjs/jest/config.cjs";

const TRANSFORM_MODULES = ["ssr-window", "swiper", "lodash-es"];

const config = {
  ...sharedConfig,
  setupFilesAfterEnv: ["<rootDir>/src/tools/cjs/jest/setupTests.cjs"],
  testRegex: "src.*(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  transformIgnorePatterns: [
    `/node_modules/(?!(${TRANSFORM_MODULES.join("|")})/)`,
  ],
};

export default config;
