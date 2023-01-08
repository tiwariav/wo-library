import fs from "node:fs";
import path from "node:path";

const INDEX_REGEX = /^index\.(\w+)$/;

export function getIndexFile(directory: string) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const match = file.match(INDEX_REGEX);
    if (match) {
      return { extension: match[1], path: `${directory}/${file}` };
    }
  }
}

type WalkOptions = {
  extensions?: string[];
  includeDirectories?: boolean;
};

export function walkIndex(directory: string, options: WalkOptions = {}) {
  const { extensions = [] } = options;
  const response = {};
  const files = fs.readdirSync(directory);
  for (const file of files) {
    var filePath = path.join(directory, file);
    if (filePath.includes("__")) {
      continue;
    }
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      const indexFile = getIndexFile(filePath);
      if (
        indexFile &&
        (extensions.length === 0 || extensions.includes(indexFile.extension))
      ) {
        response[filePath.replace("src/", "")] = indexFile.path;
      }
    }
  }
  return response;
}

export function walk(directory: string, options: WalkOptions = {}) {
  const { includeDirectories = false, extensions = ["ts", "tsx"] } = options;
  const response = {};
  const files = fs.readdirSync(directory);
  let extensionsPiped = "";
  for (const [index, element] of extensions.entries()) {
    if (index) {
      extensionsPiped += "|";
    }
    extensionsPiped += element;
  }
  const extensionsRegex = new RegExp(`.(${extensionsPiped})$`);
  for (const file of files) {
    const filePath = path.join(directory, file);
    let destinationPath = filePath;
    const stats = fs.statSync(filePath);
    if (includeDirectories && stats.isDirectory()) {
      const indexFile = getIndexFile(filePath);
      if (indexFile && extensions.includes(indexFile.extension)) {
        destinationPath = indexFile.path;
      } else {
        continue;
      }
    } else if (
      extensions.length > 0 &&
      !extensions.some((item) => filePath.endsWith(item))
    ) {
      continue;
    }
    response[filePath.replace("src/", "").replace(extensionsRegex, "")] =
      destinationPath;
  }
  return response;
}
