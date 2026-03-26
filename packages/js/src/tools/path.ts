/**
 * Converts a file path to POSIX format by replacing backslashes with forward slashes.
 *
 * @param path - The file path to convert
 * @returns The path with all backslashes replaced by forward slashes
 *
 * @example
 * ```typescript
 * posixPath("C:\\Users\\docs\\file.txt"); // "C:/Users/docs/file.txt"
 * posixPath("src/utils/index.ts");          // "src/utils/index.ts" (unchanged)
 * ```
 */
export function posixPath(path: string) {
  return path.replaceAll("\\", "/");
}
