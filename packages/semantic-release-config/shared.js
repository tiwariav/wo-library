/**
 * Shared release configuration for conventional commits.
 * Used by both semantic-release and Nx release.
 */

const conventionalCommitTypes = {
  build: {
    hidden: true,
    semverBump: "none",
    title: "Build",
  },
  chore: {
    hidden: true,
    semverBump: "none",
    title: "Chores",
  },
  ci: {
    hidden: true,
    semverBump: "none",
    title: "CI",
  },
  docs: {
    hidden: false,
    semverBump: "patch",
    title: "📚 Documentation",
  },
  feat: {
    hidden: false,
    semverBump: "minor",
    title: "✨ Features",
  },
  fix: {
    hidden: false,
    semverBump: "patch",
    title: "🐛 Bug Fixes",
  },
  perf: {
    hidden: false,
    semverBump: "patch",
    title: "⚡️ Performance Improvements",
  },
  refactor: {
    hidden: false,
    semverBump: "patch",
    title: "♻️ Code Refactors",
  },
  revert: {
    hidden: false,
    semverBump: "patch",
    title: "Reverts",
  },
  style: {
    hidden: false,
    semverBump: "none",
    title: "🎨 Styles",
  },
  test: {
    hidden: false,
    semverBump: "none",
    title: "🚦 Tests",
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
      changelog: {
        hidden: config.hidden,
        title: config.title,
      },
      semverBump: config.semverBump,
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
      rules.push({ release: config.semverBump, type });
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
    hidden: config.hidden,
    section: config.title,
    type,
  }));
}

module.exports = {
  branches,
  commitMessage,
  conventionalCommitTypes,
  getNxConventionalCommits,
  getSemanticReleaseRules,
  getSemanticReleaseTypes,
  nxCommitMessage,
};
