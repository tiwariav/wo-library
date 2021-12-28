import path from "node:path";
import { posixPath } from "ye-ui/lib/path";

const packageName = "wo-library";

export function getStoryName(filename: string): string {
  const dirname = path.dirname(filename);
  const storyName = posixPath(dirname).split(`/${packageName}/`)[1];
  return `${packageName}/${storyName}`;
}

export function getStoryFile(storyKind: string): string {
  return storyKind;
}
