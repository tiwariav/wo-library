const fs = require("fs");

const distPath = "./dist";

module.exports = {
  branches: ["main", "master", "+([0-9])?(.{+([0-9]),x}).x"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        releaseRules: [
          { breaking: true, release: "major" },
          { release: "patch", revert: true },
          { release: "minor", type: "feat" },
          { release: "patch", type: "fix" },
          { release: "patch", type: "perf" },
          { release: "patch", type: "refactor" },
        ],
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            { section: "✨ Features", type: "feat" },
            { section: "🐛 Bug Fixes", type: "fix" },
            { section: "⚡️ Performance Improvements", type: "perf" },
            { section: "Reverts", type: "revert" },
            { hidden: false, section: "📚 Documentation", type: "docs" },
            { hidden: false, section: "🎨 Styles", type: "style" },
            {
              hidden: false,
              section: "♻️ Code Refactors",
              type: "refactor",
            },
            { hidden: false, section: "🚦 Tests", type: "test" },
          ],
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
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};
