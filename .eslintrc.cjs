/* eslint-disable unicorn/prefer-module */
module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:compat/recommended",
    "plugin:css-modules/recommended",
    "plugin:eslint-comments/recommended",
    "plugin:lodash/recommended",
    "plugin:prettier/recommended",
    "plugin:sonarjs/recommended",
    "plugin:unicorn/recommended",
    "react-app",
    "react-app/jest",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["css-modules", "formatjs", "lodash", "sonarjs", "sort-keys-fix"],
  root: true,
  rules: {
    "@typescript-eslint/no-use-before-define": ["error"],
    "css-modules/no-undef-class": ["off", { camelCase: true }],
    "css-modules/no-unused-class": ["off", { camelCase: true }],
    "eslint-comments/disable-enable-pair": ["error", { allowWholeFile: true }],
    "jest/valid-describe": "off",
    "jest/valid-describe-callback": "warn",
    "lodash/import-scope": ["error", "member"],
    "lodash/prefer-lodash-method": "off",
    "no-use-before-define": "off",
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    "sonarjs/cognitive-complexity": "warn",
    "sort-keys-fix/sort-keys-fix": [
      "warn",
      "asc",
      {
        // allowLineSeparatedGroups: true, throws error as invalid option
        caseSensitive: false,
        natural: true,
      },
    ],
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
  },
  settings: {
    lintAllEsApis: true,
  },
};
