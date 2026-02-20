/* eslint-disable unicorn/prefer-module */
const fs = require("node:fs");
const path = require("node:path");

function readPackageJSON(directory) {
  const file = path.join(directory, "package.json");
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file));
  }
  return null;
}

module.exports = {
  readPackageJSON,
};
