// used by storybook to add typescript support
module.exports = {
  plugins: [
    "@babel/plugin-proposal-class-properties",
    [
      "@simbathesailor/babel-plugin-use-what-changed",
      {
        active: process.env.NODE_ENV === "development",
      },
    ],
  ],
  presets: [
    "@babel/preset-env",
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
    "@babel/preset-typescript",
  ],
};
