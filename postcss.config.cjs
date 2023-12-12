/* eslint-disable unicorn/prefer-module */
const { getConfig } = require("./src/tools/cjs/postcss.cjs");

module.exports = getConfig({ isDev: process.env.NODE_ENV === "development" });
