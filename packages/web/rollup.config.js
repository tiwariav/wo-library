import { getEsConfig } from "./src/tools/rollup/configs.js";

const config = getEsConfig({ isDev: false });

config.input = "src/index.ts";
config.output.dir = "dist";

export default config;
