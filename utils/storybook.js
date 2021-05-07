import { posixPath } from "ye-ui/lib/path";

const PACKAGE_NAME = "wo-library";

export function getStoryName(dirname) {
  const storyName = posixPath(dirname).split(`/${PACKAGE_NAME}/`)[1];
  return `${PACKAGE_NAME}/${storyName}`;
}

export function getStoryFile(storyKind) {
  return storyKind;
}
