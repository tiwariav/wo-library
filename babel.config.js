import { getConfig } from "./src/tools/babel.js";

export default getConfig({ isDev: process.env.NODE_ENV === "development" });
