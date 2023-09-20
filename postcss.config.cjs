/* eslint-disable unicorn/prefer-module */
/* used only by storybook */

const { getFinalConfig } = require("./src/tools/cjs/postcss.cjs");
module.exports = getFinalConfig("development");
