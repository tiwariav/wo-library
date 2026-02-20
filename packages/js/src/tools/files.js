import fs from "node:fs";
import path from "node:path";

export function copyToDestination(
  filePath,
  { destination = "dist", source = "src" } = {},
) {
  const outPath = path.resolve(
    path.join(process.cwd(), destination, path.relative(source, filePath)),
  );
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.copyFile(filePath, outPath, (error) => {
    if (error) {
      throw error;
    }
  });
}
