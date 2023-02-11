function isMatchSingle(include: string | RegExp, module: string) {
  return new RegExp(include, "g").test(module);
}

function isMatch(include: string | RegExp, module: string) {
  if (include === undefined) return true;
  return Array.isArray(include)
    ? include.some((index: string | RegExp) => isMatchSingle(index, module))
    : isMatchSingle(include, module);
}

export default function externalAsset({
  include,
  copyTargets,
  assetTargetDir,
}: {
  include: string | RegExp;
  copyTargets?: object[];
  assetTargetDir?: string;
}) {
  return {
    name: "rollup-plugin-external-asset",
    resolveId(source: string) {
      if (!isMatch(include, source)) return null;
      copyTargets && copyTargets.push({ dest: assetTargetDir, src: source });
      return { external: true, id: source };
    },
  };
}
