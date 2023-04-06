import { Config } from "jest";
// @ts-ignore: TS2835 because jest.config.ts is not read as module by jest
import { config as sharedConfig } from "./src/tools/cjs/jest/config.cjs";

const config: Config = {
  ...(sharedConfig as Config),
  testRegex: "src.*(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$",
};

export default config;
