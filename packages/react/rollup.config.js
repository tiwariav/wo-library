import dotenv from "dotenv";
import { getEsConfig } from "../js/src/tools/rollup/configs.js";
import { getPublishPlugins } from "../js/src/tools/rollup/pluginSets.js";

dotenv.config();

const isDev = process.env.NODE_ENV === "development";

const esConfig = getEsConfig({ isDev });
esConfig.plugins.push(...getPublishPlugins({ removePostInstall: true }));

export default esConfig;
