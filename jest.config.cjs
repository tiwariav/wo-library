const path = require("node:path");

const reportsDirectory = path.join(process.cwd(), "reports");

const ciReporters = [
  [
    "jest-junit",
    {
      outputDirectory: reportsDirectory,
    },
  ],
];
const devReporters = [
  [
    "jest-html-reporter",
    {
      outputPath: `${reportsDirectory}/test-report.html`,
      pageTitle: "Test Report",
    },
  ],
  [
    "jest-html-reporters",
    {
      filename: "test-reports.html",
      publicPath: reportsDirectory,
    },
  ],
];
const reporters = process.env.CI
  ? [...devReporters, ...ciReporters]
  : devReporters;

module.exports = {
  collectCoverageFrom: ["**/{webapps,packages}/**/*.{js,jsx}"],
  coverageDirectory: "reports",
  coveragePathIgnorePatterns: ["/node_modules/", "/build/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "<rootDir>/tests/__mocks__/styleMock.js",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/tests/__mocks__/fileMock.js",
  },
  reporters: [
    /*
      jest-html-reporters and jest-html-reporter (without trailing 's')
      are completely different reporters, evaluating both right now
    */
    "default",
    ...reporters,
  ],
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.js"],
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/.yarn/", "/node_modules/", "/build/"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.mdx?$": "@storybook/addon-docs/jest-transform-mdx",
    "^.+\\.tsx?$": "ts-jest",
  },
};
