const config = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/tools/constants/props.ts",
    "src/tools/storybook.tsx",
    "src/tools/uploadFile.ts",
    "src/tools/utils.ts",
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
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/tools/__tests__/**/*.test.ts?(x)"],
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!lodash-es|@tabler/)"],
};

export default config;
