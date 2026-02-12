const { getConfig } = require("wo-library/tools/cjs/babel.cjs");

module.exports = getConfig({ isDev: process.env.NODE_ENV === "development" });
