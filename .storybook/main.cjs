const { storybook } = require("../src/tools/cjs/index.cjs");
const { main } = storybook;

module.exports = {
  ...main,
  stories: ["../!(node_modules|dist)/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
};
