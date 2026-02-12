const getConfig = ({ isDev = false } = {}) => ({
  plugins: [
    "@babel/plugin-transform-runtime",
    [
      "@simbathesailor/babel-plugin-use-what-changed",
      {
        active: isDev,
      },
    ],
  ],
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
      },
    ],
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
    "@babel/preset-typescript",
  ],
  targets: {
    esmodules: true,
  },
});

module.exports = {
  getConfig,
};
