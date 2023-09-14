const config = {
  branches: ["main", "1.x"],
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
    "@semantic-release/github",
    "@semantic-release/changelog",
    [
      "@semantic-release/npm",
      {
        pkgRoot: "dist",
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json"],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};

module.exports = { config };
