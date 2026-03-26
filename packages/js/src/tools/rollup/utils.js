import { globSync } from "glob";
import path from "node:path";

export function getInput(
  directory,
  {
    excludeDirectories = [],
    extension = "!(*.test|*.stories|*.d).{js,jsx,ts,tsx}",
    sourceDirectory = "src",
  } = {},
) {
  const pattern = `${directory}/**/${extension}`;
  const response = [];
  for (const file of globSync(pattern)) {
    if (
      file.includes("__") ||
      excludeDirectories.some((item) => file.includes(item))
    ) {
      continue;
    }
    response.push([
      // This removes `sourceDirectory` as well as the file extension
      // from each file, so e.g. src/nested/foo.js becomes nested/foo
      path.relative(
        sourceDirectory,
        file.slice(0, file.length - path.extname(file).length),
      ),
      path.join(process.cwd(), file),
    ]);
  }
  return Object.fromEntries(response);
}

export function addBanner(chunk, { scriptDirectory = "scripts/" } = {}) {
  if (chunk.fileName.startsWith(scriptDirectory)) {
    return "#!/usr/bin/env node";
  }
  if (chunk.fileName.endsWith(".module.css.js")) {
    const fileName = chunk.fileName.split("/").pop();
    return `import "./${fileName.replace(".module.css.js", ".css")}";\n`;
  }
  return "";
}
