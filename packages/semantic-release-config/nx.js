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
    createGitHubRelease = true,
    packageRoot = "dist/{projectName}",
    projects = ["packages/*"],
  } = options;

  return {
    release: {
      changelog: {
        conventionalCommits: getNxConventionalCommits(),
        projectChangelogs: {
          createRelease: createGitHubRelease ? "github" : false,
          file: "{projectRoot}/CHANGELOG.md",
          renderOptions: {
            authors: true,
            commitReferences: true,
            versionTitleDate: true,
          },
        },
        workspaceChangelog: {
          createRelease: createGitHubRelease ? "github" : false,
          file: "CHANGELOG.md",
          renderOptions: {
            authors: true,
            commitReferences: true,
            versionTitleDate: true,
          },
        },
      },
      git: {
        commitMessage: nxCommitMessage,
      },
      projects,
      projectsRelationship: "independent",
      version: {
        conventionalCommits: true,
        generatorOptions: {
          currentVersionResolver: "git-tag",
          packageRoot,
        },
      },
    },
  };
}

module.exports = {
  getNxConventionalCommits,
  getNxReleaseConfig,
  nxCommitMessage,
};
