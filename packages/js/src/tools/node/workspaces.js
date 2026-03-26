import micromatch from "micromatch";
import path from "node:path";

import { readPackageJSON } from "./nodeUtilities.js";

export function extractWorkspaces(manifest) {
  const { workspaces } = manifest || {};
  return (
    workspaces?.packages ?? (Array.isArray(workspaces) ? workspaces : null)
  );
}

/**
 * Adapted from:
 * https://github.com/yarnpkg/yarn/blob/ddf2f9ade211195372236c2f39a75b00fa18d4de/src/config.js#L612
 */
export function findWorkspaceRoot(initial) {
  const targetPath = initial ?? process.cwd();
  let previous;
  let current = path.normalize(targetPath);

  do {
    const manifest = readPackageJSON(current);
    const workspaces = extractWorkspaces(manifest);

    if (workspaces) {
      const relativePath = path.relative(current, targetPath);
      return relativePath === "" ||
        micromatch([relativePath], workspaces).length > 0
        ? current
        : undefined;
    }

    previous = current;
    current = path.dirname(current);
  } while (current !== previous);
}

export function workspacePackages() {
  const workspaceRoot = findWorkspaceRoot();
  const manifest = readPackageJSON(workspaceRoot);
  return extractWorkspaces(manifest);
}
