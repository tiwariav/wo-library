import dotenv from "dotenv";

import {
  getCjsConfig,
  getCssConfig,
  getEsConfig,
} from "@wo-library/js/tools/rollup/configs.js";
import { getPublishPlugins } from "@wo-library/js/tools/rollup/pluginSets.js";

dotenv.config();

const isDev = process.env.NODE_ENV === "development";

const cjsConfig = getCjsConfig({ isDev });
cjsConfig.plugins.push(...getPublishPlugins({ removePostInstall: true }));

const config = [cjsConfig, getEsConfig({ isDev }), getCssConfig({ isDev })];

export default config;
