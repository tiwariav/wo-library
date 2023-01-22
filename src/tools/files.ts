import glob from "glob";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function rollupInputMap(
  root,
  directory,
  extension = "!(*.d).{js,jsx,ts,tsx}"
) {
  const pattern = `${directory}/**/${extension}`;
  return Object.fromEntries(
    glob.sync(pattern).map((file) => [
      // This remove `src/` as well as the file extension from each
      // file, so e.g. src/nested/foo.js becomes nested/foo
      path.relative(
        directory,
        file.slice(0, file.length - path.extname(file).length)
      ),
      // This expands the relative paths to absolute paths, so e.g.
      // src/nested/foo becomes /project/src/nested/foo.js
      fileURLToPath(new URL(file, root)),
    ])
  );
}
