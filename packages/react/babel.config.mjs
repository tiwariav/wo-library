import { getConfig } from "../js/src/tools/node/babel.js";

export default getConfig({ isDev: process.env.NODE_ENV === "development" });
