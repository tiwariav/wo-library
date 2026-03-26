const config = {
  collectCoverage: true,
  coverageProvider: "v8",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!lodash-es|@tabler|default-import)/",
  ],
};

module.exports = { config };
