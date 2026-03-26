import { config as sharedConfig } from "../js/src/tools/node/jest/config.js";

const TRANSFORM_MODULES = ["default-import", "lodash-es"];

const config = {
  ...sharedConfig,
  setupFilesAfterEnv: ["../web/src/tools/node/jest/setupTests.js"],
  testRegex: String.raw`src.*(/__tests__/.*|(\.|/)(test|spec))\.[jt]sx?$`,
  transformIgnorePatterns: [
    `/node_modules/(?!(${TRANSFORM_MODULES.join("|")})/)`,
  ],
};

export default config;
