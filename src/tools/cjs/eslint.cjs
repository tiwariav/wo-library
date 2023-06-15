const EXTEND_RECOMMENDED = "eslint:recommended";
const extendJs = [
  "plugin:compat/recommended",
  "plugin:css-modules/recommended",
  "plugin:eslint-comments/recommended",
  "plugin:import/recommended",
  "plugin:lodash/recommended",
  "plugin:perfectionist/recommended-natural",
  "plugin:sonarjs/recommended",
  "plugin:unicorn/recommended",
  "react-app",
  "react-app/jest",
  "prettier",
];

const extendTs = ["plugin:@typescript-eslint/recommended", ...extendJs];
extendTs.splice(3, 0, "plugin:etc/recommended");

const rulesJs = {
  "css-modules/no-undef-class": ["error", { camelCase: true }],
  "css-modules/no-unused-class": ["error", { camelCase: true }],
  "eslint-comments/disable-enable-pair": ["error", { allowWholeFile: true }],
  "jest/valid-describe": "off",
  "jest/valid-describe-callback": "warn",
  "lodash/import-scope": ["error", "member"],
  "lodash/prefer-lodash-method": "off",
  "sonarjs/cognitive-complexity": "warn",
  "unicorn/filename-case": [
    "warn",
    {
      cases: {
        camelCase: true,
        pascalCase: true,
      },
    },
  ],
  "unicorn/no-nested-ternary": "off",
  "unicorn/no-null": "off",
  "unicorn/prefer-top-level-await": "off",
  "unicorn/prevent-abbreviations": [
    "error",
    {
      replacements: {
        arg: { argument: false },
        args: { arguments: false },
        dev: { development: false },
        env: { environment: false },
        envs: { environments: false },
        param: { parameter: false },
        params: { parameters: false },
        prop: { property: false },
        props: { properties: false },
        ref: { reference: false },
        refs: { references: false },
        temp: { temporary: false },
        tmp: { temp: true },
      },
    },
  ],
};

const rulesTs = {
  ...rulesJs,
  "@typescript-eslint/ban-ts-comment": [
    "error",
    {
      "ts-ignore": { descriptionFormat: "^: TS\\d+ because .+$" },
    },
  ],
  "etc/no-deprecated": "off",
  "etc/no-internal": "off",
};

const plugins = ["css-modules", "formatjs", "lodash", "sonarjs"];

const nextOverride = {
  extends: [
    EXTEND_RECOMMENDED,
    ...extendTs,
    "plugin:@next/next/recommended",
    "plugin:@next/next/core-web-vitals",
  ],
  files: ["webapps/teaser/**/*.{ts,tsx}"],
  rules: rulesTs,
};

const config = {
  env: {
    browser: true,
    node: true,
  },
  extends: [EXTEND_RECOMMENDED, ...extendJs],
  overrides: [
    // typescript
    {
      extends: [EXTEND_RECOMMENDED, ...extendTs],
      files: ["*.{ts,tsx}"],
      rules: rulesTs,
    },
  ],
  parser: "@typescript-eslint/parser",
  plugins: plugins,
  root: true,
  rules: rulesJs,
  settings: {
    lintAllEsApis: true,
  },
};

module.exports = {
  config,
  extendJs,
  extendTs,
  nextOverride,
  plugins,
  rulesJs,
  rulesTs,
};
