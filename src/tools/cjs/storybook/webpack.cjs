const css_regex = "/\\.css$/";

function cssModules(config, { configType }) {
  const cssRule = config.module.rules.find(
    (rule) => rule.test && rule.test.toString() === css_regex
  );
  config.module.rules = [
    ...config.module.rules.filter(
      (rule) => rule.test && rule.test.toString() !== css_regex
    ),
    {
      ...cssRule,
      exclude: /\.module\.css$/,
    },
    {
      ...cssRule,
      test: /\.module\.css$/,
      use: cssRule.use.map((rule) => {
        if (rule && rule.loader && rule.loader.match(/\Wcss-loader/g)) {
          return {
            ...rule,
            options: {
              ...rule.options,
              sourceMap: true,
              localsConvention: "camelCase",
              modules: {
                localIdentName:
                  configType === "DEVELOPMENT"
                    ? "[name]__[local]"
                    : "[hash:base64]",
              },
            },
          };
        }
        return rule;
      }),
    },
  ];
  return config;
}

function sass(config) {
  config.module.rules.push({
    test: /\.scss$/,
    use: ["style-loader", "css-loader", "sass-loader"],
  });
  return config;
}

function modulesFullySpecified(config) {
  for (const rule of config.module.rules) {
    if (String(rule.test).includes("js")) {
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

function nodeNextExtensionAlias(config) {
  config.resolve.extensionAlias = {
    ".js": [".js", ".ts", ".tsx"],
  };
  return config;
}

module.exports = {
  cssModules,
  sass,
  modulesFullySpecified,
  nodeNextExtensionAlias,
};
