import dotenv from "dotenv";
import { getCssConfig, getEsConfig } from "../js/src/tools/rollup/configs.js";
import { getPublishPlugins } from "../js/src/tools/rollup/pluginSets.js";

dotenv.config();

const isDev = process.env.NODE_ENV === "development";

const cssConfig = getCssConfig({ isDev });
const jsConfig = getEsConfig({ isDev });

jsConfig.plugins.push(...getPublishPlugins({ removePostInstall: true }));

export default [cssConfig, jsConfig];
