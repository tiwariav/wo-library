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

const config = {
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
  coverageDirectory: "reports",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/build/",
    "/out/",
    "/.next/",
  ],
  coverageProvider: "v8",
  extensionsToTreatAsEsm: [".ts", ".tsx", ".jsx"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "jest-transform-stub",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  reporters: [
    /*
      jest-html-reporters and jest-html-reporter (without trailing 's')
      are completely different reporters, evaluating both right now
    */
    "default",
    // @ts-expect-error: TS2322 because ReporterConfig is not exported from jest
    ...reporters,
  ],
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/reports/"],
  transform: {
    "^.+\\.m?jsx?$": "babel-jest",
    "^.+\\.mdx?$": "@storybook/addon-docs/jest-transform-mdx",
    "^.+\\.tsx?$": "babel-jest",
  },
};

module.exports = {
  ciReporters,
  config,
  devReporters,
  reporters,
  reportsDirectory,
};
