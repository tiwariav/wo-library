import { getPublishPlugins } from "../web/src/tools/rollup/pluginSets.js";
import { getEsConfig, getCssConfig } from "../web/src/tools/rollup/configs.js";
import dotenv from "dotenv";

dotenv.config();

const isDev = process.env.NODE_ENV === "development";

const cssConfig = getCssConfig({ isDev });
const jsConfig = getEsConfig({ isDev });

jsConfig.plugins.push(...getPublishPlugins({ removePostInstall: true }));

export default [cssConfig, jsConfig];
