const { getConfig } = require("./src/tools/cjs/babel.cjs");

module.exports = getConfig({ isDev: process.env.NODE_ENV === "development" });
