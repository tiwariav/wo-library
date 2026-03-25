import fs from "node:fs";
import path from "node:path";

export function readPackageJSON(directory) {
  const file = path.join(directory, "package.json");
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file));
  }
  return null;
}
