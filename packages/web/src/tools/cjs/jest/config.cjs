const config = {
  collectCoverage: true,
  coverageProvider: "v8",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
  testEnvironment: "jsdom",
  transformIgnorePatterns: ["/node_modules/(?!lodash-es|@tabler|default-import)/"],
  transform: {
    "^.+\\.tsx?$": "babel-jest",
  },
};

module.exports = { config };
