const config = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/index.ts",
    "src/tools/**/*.{ts,tsx}",
    "!src/tools/**/*.d.ts",
    "!src/tools/cjs/**",
    "!src/tools/rollup/**",
    "!src/tools/**/__tests__/**",
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
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/__tests__/**/*.test.ts"],
  transformIgnorePatterns: ["/node_modules/(?!lodash-es/)"],
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
};

module.exports = config;
