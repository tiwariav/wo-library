function isMatchSingle(include: RegExp | string, module: string) {
  return new RegExp(include, "g").test(module);
}

function isMatch(include: RegExp | string, module: string) {
  if (include === undefined) return true;
  return Array.isArray(include)
    ? include.some((index: RegExp | string) => isMatchSingle(index, module))
    : isMatchSingle(include, module);
}

export default function externalAssets({
  assetTargetDir,
  copyTargets,
  include,
  replaceImports,
}: {
  assetTargetDir?: string;
  copyTargets?: object[];
  include: RegExp | string;
  replaceImports?: [RegExp, string];
}) {
  return {
    name: "rollup-plugin-external-asset",
    renderChunk(code: string) {
      if (!replaceImports) return null;
      return code.replace(replaceImports[0], replaceImports[1]);
    },
    resolveId(source: string) {
      if (!isMatch(include, source)) return null;
      copyTargets && copyTargets.push({ dest: assetTargetDir, src: source });
      return { external: true, id: source };
    },
  };
}
