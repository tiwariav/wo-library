import dotenv from "dotenv";
import {
  getCjsConfig,
  getEsConfig,
} from "../web/src/tools/rollup/configs.js";
import { getPublishPlugins } from "../web/src/tools/rollup/pluginSets.js";

dotenv.config();

const isDev = process.env.NODE_ENV === "development";

const cjsConfig = getCjsConfig({ isDev });
cjsConfig.plugins.push(...getPublishPlugins({ removePostInstall: true }));

const config = [cjsConfig, getEsConfig({ isDev })];

export default config;
