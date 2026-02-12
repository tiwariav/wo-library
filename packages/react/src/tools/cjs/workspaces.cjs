/* eslint-disable unicorn/prefer-module */
const { readPackageJSON } = require("./nodeUtils.cjs");
const micromatch = require("micromatch");
const path = require("node:path");

function extractWorkspaces(manifest) {
  const { workspaces } = manifest || {};
  return (
    (workspaces && workspaces.packages) ||
    (Array.isArray(workspaces) ? workspaces : null)
  );
}

/**
 * Adapted from:
 * https://github.com/yarnpkg/yarn/blob/ddf2f9ade211195372236c2f39a75b00fa18d4de/src/config.js#L612
 */
function findWorkspaceRoot(initial) {
  let previous;
  let current = path.normalize(initial ?? process.cwd());

  do {
    const manifest = readPackageJSON(current);
    const workspaces = extractWorkspaces(manifest);

    if (workspaces) {
      const relativePath = path.relative(current, initial);
      return relativePath === "" ||
        micromatch([relativePath], workspaces).length > 0
        ? current
        : undefined;
    }

    previous = current;
    current = path.dirname(current);
  } while (current !== previous);
}

function workspacePackages() {
  const workspaceRoot = findWorkspaceRoot();
  const manifest = readPackageJSON(workspaceRoot);
  return extractWorkspaces(manifest);
}

module.exports = {
  extractWorkspaces,
  findWorkspaceRoot,
  readPackageJSON,
  workspacePackages,
};
