export const getConfig = ({ isDev = false } = {}) => ({
  plugins: ["@babel/plugin-transform-runtime"],
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
