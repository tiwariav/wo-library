import path from "node:path";

export const reportsDirectory = path.join(process.cwd(), "reports");

export const ciReporters = [
  [
    "jest-junit",
    {
      outputDirectory: reportsDirectory,
    },
  ],
];

export const devReporters = [
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

export const reporters = process.env.CI
  ? [...devReporters, ...ciReporters]
  : devReporters;

export const config = {
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
    "default",
    // @ts-expect-error: TS2322 because ReporterConfig is not exported from jest
    ...reporters,
  ],
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/reports/"],
  transform: {
    "^.+\\.m?jsx?$": "babel-jest",
    "^.+\\.tsx?$": "babel-jest",
  },
};
