const config = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/index.ts",
    "src/tools/index.ts",
    "src/tools/css.ts",
    "src/tools/loadStylesheet.ts",
    "src/tools/svg.ts",
    "src/tools/error/index.ts",
    "src/tools/others/index.ts",
  ],
  coverageProvider: "v8",
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/**/__tests__/**/*.test.ts"],
  transformIgnorePatterns: ["/node_modules/(?!lodash-es|type-fest/)"],
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
};

module.exports = config;
