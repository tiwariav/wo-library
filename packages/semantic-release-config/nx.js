/**
 * Nx release configuration helper.
 *
 * Usage in nx.json or nx.config.js:
 *
 * const { getNxReleaseConfig } = require("@wo-library/semantic-release-config/nx");
 *
 * module.exports = {
 *   ...getNxReleaseConfig({
 *     projects: ["packages/*"],
 *     createGitHubRelease: true,
 *   }),
 * };
 */

const { getNxConventionalCommits, nxCommitMessage } = require("./shared.js");

/**
 * Get Nx release configuration
 * @param {Object} options - Configuration options
 * @param {string|string[]} options.projects - Projects glob pattern(s)
 * @param {boolean} [options.createGitHubRelease=true] - Whether to create GitHub releases
 * @param {string} [options.packageRoot] - Package root pattern for versioning
 * @returns {Object} Nx release configuration
 */
function getNxReleaseConfig(options = {}) {
  const {
    projects = ["packages/*"],
    createGitHubRelease = true,
    packageRoot = "dist/{projectName}",
  } = options;

  return {
    release: {
      projectsRelationship: "independent",
      projects,
      version: {
        conventionalCommits: true,
        generatorOptions: {
          packageRoot,
          currentVersionResolver: "git-tag",
        },
      },
      changelog: {
        workspaceChangelog: {
          createRelease: createGitHubRelease ? "github" : false,
          file: "CHANGELOG.md",
          renderOptions: {
            authors: true,
            commitReferences: true,
            versionTitleDate: true,
          },
        },
        projectChangelogs: {
          createRelease: createGitHubRelease ? "github" : false,
          file: "{projectRoot}/CHANGELOG.md",
          renderOptions: {
            authors: true,
            commitReferences: true,
            versionTitleDate: true,
          },
        },
        conventionalCommits: getNxConventionalCommits(),
      },
      git: {
        commitMessage: nxCommitMessage,
      },
    },
  };
}

module.exports = {
  getNxReleaseConfig,
  getNxConventionalCommits,
  nxCommitMessage,
};
