import dotenv from "dotenv";

import {
  getCjsConfig,
  getCssConfig,
  getEsConfig,
} from "./src/tools/rollup/configs.js";
import { getPublishPlugins } from "./src/tools/rollup/pluginSets.js";

dotenv.config();

const isDev = process.env.NODE_ENV === "development";

const cjsConfig = getCjsConfig({ isDev });
cjsConfig.plugins.push(...getPublishPlugins({ removePostInstall: true }));

const config = [cjsConfig, getEsConfig({ isDev }), getCssConfig({ isDev })];

export default config;
