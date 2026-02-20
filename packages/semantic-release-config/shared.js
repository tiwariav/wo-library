/**
 * Shared release configuration for conventional commits.
 * Used by both semantic-release and Nx release.
 */

const conventionalCommitTypes = {
  feat: {
    title: "✨ Features",
    semverBump: "minor",
    hidden: false,
  },
  fix: {
    title: "🐛 Bug Fixes",
    semverBump: "patch",
    hidden: false,
  },
  perf: {
    title: "⚡️ Performance Improvements",
    semverBump: "patch",
    hidden: false,
  },
  refactor: {
    title: "♻️ Code Refactors",
    semverBump: "patch",
    hidden: false,
  },
  docs: {
    title: "📚 Documentation",
    semverBump: "patch",
    hidden: false,
  },
  style: {
    title: "🎨 Styles",
    semverBump: "none",
    hidden: false,
  },
  test: {
    title: "🚦 Tests",
    semverBump: "none",
    hidden: false,
  },
  revert: {
    title: "Reverts",
    semverBump: "patch",
    hidden: false,
  },
  chore: {
    title: "Chores",
    semverBump: "none",
    hidden: true,
  },
  ci: {
    title: "CI",
    semverBump: "none",
    hidden: true,
  },
  build: {
    title: "Build",
    semverBump: "none",
    hidden: true,
  },
};

const branches = ["main", "master", "+([0-9])?(.{+([0-9]),x}).x"];

const commitMessage =
  "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}";
const nxCommitMessage = "chore(release): publish {version} [skip ci]";

/**
 * Get Nx release conventional commits configuration
 * @returns {Object} Nx-compatible conventionalCommits config
 */
function getNxConventionalCommits() {
  const types = {};
  for (const [type, config] of Object.entries(conventionalCommitTypes)) {
    types[type] = {
      semverBump: config.semverBump,
      changelog: {
        title: config.title,
        hidden: config.hidden,
      },
    };
  }
  return { types };
}

/**
 * Get semantic-release release rules
 * @returns {Array} Release rules for @semantic-release/commit-analyzer
 */
function getSemanticReleaseRules() {
  const rules = [{ breaking: true, release: "major" }];
  for (const [type, config] of Object.entries(conventionalCommitTypes)) {
    if (config.semverBump !== "none") {
      rules.push({ type, release: config.semverBump });
    }
  }
  return rules;
}

/**
 * Get semantic-release preset types for release-notes-generator
 * @returns {Array} Types config for conventionalcommits preset
 */
function getSemanticReleaseTypes() {
  return Object.entries(conventionalCommitTypes).map(([type, config]) => ({
    type,
    section: config.title,
    hidden: config.hidden,
  }));
}

module.exports = {
  conventionalCommitTypes,
  branches,
  commitMessage,
  nxCommitMessage,
  getNxConventionalCommits,
  getSemanticReleaseRules,
  getSemanticReleaseTypes,
};
