export function posixPath(path: string) {
  return path.replaceAll("\\", "/");
}
