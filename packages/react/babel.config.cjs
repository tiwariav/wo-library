const { getConfig } = require("@wo-library/js/tools/cjs/babel.cjs");

module.exports = getConfig({ isDev: process.env.NODE_ENV === "development" });
