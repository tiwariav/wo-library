const fs = require("fs");
const {
  branches,
  commitMessage,
  getSemanticReleaseRules,
  getSemanticReleaseTypes,
} = require("./shared.js");

const distPath = "./dist";

module.exports = {
  branches,
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        releaseRules: getSemanticReleaseRules(),
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: getSemanticReleaseTypes(),
        },
      },
    ],
    "@semantic-release/changelog",
    ...(process.env.GITHUB_TOKEN ? ["@semantic-release/github"] : []),
    ...(process.env.GITLAB_TOKEN ? ["@semantic-release/gitlab"] : []),
    [
      // NOTE: NPM_TOKEN required to publish to npm
      "@semantic-release/npm",
      {
        pkgRoot: fs.existsSync(distPath) ? distPath : "./",
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: [
          "CHANGELOG.md",
          "package.json",
          "!(.yarn|node_modules)/**/(!node_modules|.yarn)/**/ios/*/Info.plist",
          "!(.yarn|node_modules)/**/(!node_modules|.yarn)/**/ios/*/project.pbxproj",
          "!(.yarn|node_modules)/**/(!node_modules|.yarn)/**/android/app/build.gradle",
        ],
        message: commitMessage,
      },
    ],
  ],
};
