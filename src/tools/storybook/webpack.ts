import { isObject } from "lodash-es";
import { Configuration } from "webpack";

export function modulesFullySpecified(config: Configuration) {
  if (!config.module?.rules) return config;
  for (const rule of config.module.rules) {
    if (isObject(rule) && rule.test?.toString().includes("js")) {
      if (rule.resolve) {
        // disables compulsory file extension in import for modules
        rule.resolve.fullySpecified = false;
      } else {
        rule.resolve = { fullySpecified: false };
      }
    }
  }
  return config;
}

export function nodeNextExtensionAlias(config: Configuration) {
  if (!config.resolve) return config;
  config.resolve.extensionAlias = {
    ".js": [".js", ".jsx", ".ts", ".tsx"],
  };
  return config;
}
