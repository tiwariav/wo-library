/* eslint-disable unicorn/prefer-module */
const { getConfig } = require("@tiwariav/postcss-config");

module.exports = getConfig(process.env.NODE_ENV || "development");
