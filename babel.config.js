import { getConfig } from "./src/tools/cjs/babel.cjs";

export default getConfig({ isDev: process.env.NODE_ENV === "development" });
