const config = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/styles/media.ts",
    "src/svg/paths/index.ts",
    "src/svg/paths/Pin.ts",
    "src/svg/paths/Flag.ts",
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
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
};

export default config;
