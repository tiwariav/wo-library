const main = require("../src/tools/cjs/storybook/main.cjs");

module.exports = {
  ...main,
  stories: ["../!(node_modules|lib)/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
};
