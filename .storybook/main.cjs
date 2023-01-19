const main = require("../src/tools/cjs/storybook/main.cjs");

module.exports = {
  ...main,
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
};
