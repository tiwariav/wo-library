/* eslint-disable unicorn/prefer-module */
const { getConfig } = require("@wo-library/postcss-config");

module.exports = getConfig(process.env.NODE_ENV || "development", {
  globalDataOptions: {
    files: [require.resolve("@wo-library/ui/src/styles/media.css")],
  },
  presetEnvOptions: { preserveMediaQueries: true },
});
