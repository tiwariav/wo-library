import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { getConfig } from "@wo-library/postcss-config";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

const mediaFile = resolve(__dirname, "../ui/src/styles/media.css");

const { plugins } = getConfig("development", {
  globalDataOptions: { files: [mediaFile] },
});

// Remove postcss-global-import and postcss-import — webpack's css-loader
// handles @import resolution (including node_modules like normalize.css).
const filteredPlugins = plugins.filter(
  (p) => !["postcss-global-import", "postcss-import"].includes(p.postcssPlugin),
);

export default { plugins: filteredPlugins };
