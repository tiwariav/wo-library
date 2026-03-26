import path from "node:path";

import { copyToDestination } from "../files.js";

export const autoExternal = ({ assets = /assets/, copy = false } = {}) => ({
  name: "wo-library/ignore-assets",
  resolveId(source, importer) {
    if (!assets.test(source)) {
      return;
    }
    if (copy) {
      copyToDestination(path.resolve(path.dirname(importer), source));
    }
    return {
      external: true,
      id: source,
    };
  },
});

export const skipOutput = () => ({
  generateBundle(_options, bundle) {
    for (const fileName in bundle) {
      if (
        Object.prototype.hasOwnProperty.call(bundle, fileName) &&
        fileName.endsWith(".js")
      ) {
        delete bundle[fileName];
      }
    }
  },
  name: "wo-library/skip-output",
});
