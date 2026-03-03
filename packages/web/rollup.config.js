import { getEsConfig } from "../js/src/tools/rollup/configs.js";
import { getPublishPlugins } from "../js/src/tools/rollup/pluginSets.js";

const config = getEsConfig({ isDev: false });

config.input = "src/index.ts";
config.output.dir = "dist";
config.plugins.push(...getPublishPlugins({ removePostInstall: true }));

export default config;
