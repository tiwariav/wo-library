/* eslint-disable unicorn/prefer-module */
const { getConfig } = require("./src/tools/cjs/postcss.cjs");

module.exports = getConfig(process.env.NODE_ENV || "development");
