const js = require("@eslint/js");
const prettier = require("eslint-config-prettier");
const craConfig = require("eslint-config-react-app");
const compatPlugin = require("eslint-plugin-compat");
const jsxExpressionsPlugin = require("eslint-plugin-jsx-expressions");
const cssModulesPlugin = require("eslint-plugin-css-modules");
const eslintCommentsPlugin = require("eslint-plugin-eslint-comments");
const etcPlugin = require("eslint-plugin-etc");
const formatjsPlugin = require("eslint-plugin-formatjs");
const testingLibraryPlugin = require("eslint-plugin-testing-library");
const jest = require("eslint-plugin-jest");
const jsxA11yPlugin = require("eslint-plugin-jsx-a11y");
const lodashPlugin = require("eslint-plugin-lodash");
const perfectionist = require("eslint-plugin-perfectionist");
const perfectionistNatural = require("eslint-plugin-perfectionist/configs/recommended-natural");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const reactJsx = require("eslint-plugin-react/configs/jsx-runtime.js");
const reactRecommended = require("eslint-plugin-react/configs/recommended.js");
const sonarjsPlugin = require("eslint-plugin-sonarjs");
const storybookPlugin = require("eslint-plugin-storybook");
const unicorn = require("eslint-plugin-unicorn");
const unusedImportsPlugin = require("eslint-plugin-unused-imports");
const globals = require("globals");
const tsEslint = require("typescript-eslint");

function removeKeysStartingWith(object, prefixes) {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([key]) => !prefixes.some((prefix) => key.startsWith(prefix)),
    ),
  );
}

const settings = {
  lintAllEsApis: true,
  react: {
    version: "detect",
  },
};

const noMagicNumbersOptions = {
  ignore: [-1, 0, 1, 2],
  ignoreArrayIndexes: true,
  ignoreClassFieldInitialValues: true,
  ignoreDefaultValues: true,
};
const preferDestructuringOptions = {
  array: false,
  object: true,
};

module.exports = [
  js.configs.recommended,
  // enable this config only for ts files
  ...tsEslint.configs.strictTypeChecked.map((config) => ({
    ...config,
    files: ["**/*.ts?(x)"],
  })),
  ...tsEslint.configs.stylisticTypeChecked,
  compatPlugin.configs["flat/recommended"],
  reactRecommended,
  reactJsx,
  prettier,
  perfectionistNatural,
  unicorn.configs["flat/recommended"],
  jest.configs["flat/recommended"],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      "css-modules": cssModulesPlugin,
      "eslint-comments": eslintCommentsPlugin,
      etc: etcPlugin,
      formatjs: formatjsPlugin,
      "jsx-a11y": jsxA11yPlugin,
      "jsx-expressions": jsxExpressionsPlugin,
      lodash: lodashPlugin,
      perfectionist,
      "react-hooks": reactHooksPlugin,
      sonarjs: sonarjsPlugin,
      storybook: storybookPlugin,
      "testing-library": testingLibraryPlugin,
      "unused-imports": unusedImportsPlugin,
    },
    rules: {
      ...eslintCommentsPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      ...lodashPlugin.configs.recommended.rules,
      ...sonarjsPlugin.configs.recommended.rules,
      ...storybookPlugin.configs.recommended.rules,
      ...testingLibraryPlugin.configs.react.rules,
      ...removeKeysStartingWith(craConfig.rules, ["flowtype/", "import/"]),
      "css-modules/no-undef-class": ["error", { camelCase: true }],
      "css-modules/no-unused-class": ["error", { camelCase: true }],
      "eslint-comments/disable-enable-pair": [
        "error",
        { allowWholeFile: true },
      ],
      "eslint-comments/no-unused-disable": "error",
      "jest/expect-expect": [
        "error",
        {
          assertFunctionNames: ["expect", "expectResult"],
        },
      ],
      "jsx-a11y/anchor-ambiguous-text": "warn",
      "jsx-a11y/prefer-tag-over-role": "warn",
      "jsx-a11y/no-autofocus": "off",
      "lodash/import-scope": ["error", "member"],
      "lodash/prefer-lodash-method": "off",
      "perfectionist/sort-objects": [
        "error",
        {
          "partition-by-comment": "Part:**",
        },
      ],
      "react-hooks/exhaustive-deps": "error",
      "react-hooks/rules-of-hooks": "error",
      "react/boolean-prop-naming": "warn",
      "react/destructuring-assignment": "warn",
      "react/function-component-definition": "warn",
      "react/jsx-boolean-value": "error",
      "react/jsx-curly-brace-presence": [
        "error",
        {
          children: "never",
          propElementValues: "always",
          props: "never",
        },
      ],
      "react/jsx-handler-names": "error",
      "react/jsx-no-constructed-context-values": "error",
      "react/jsx-no-useless-fragment": "error",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react/no-object-type-as-default-prop": "error",
      "react/no-unstable-nested-components": "error",
      "react/prop-types": "off",
      "react/self-closing-comp": "error",
      "sonarjs/cognitive-complexity": "error",
      "sonarjs/no-inverted-boolean-check": "warn",
      // give false positives for function named ..render..
      "testing-library/render-result-naming-convention": "off",
      "unicorn/consistent-destructuring": "error",
      "unicorn/custom-error-definition": "error",
      "unicorn/filename-case": [
        "warn",
        {
          cases: {
            camelCase: true,
            pascalCase: true,
          },
        },
      ],
      // conflicts with prettier
      "unicorn/no-nested-ternary": "off",
      "unicorn/no-null": "off",
      // conflicts with prettier
      "unicorn/number-literal-case": "off",
      "unicorn/no-unused-properties": "error",
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
      "unused-imports/no-unused-imports": "error",

      // Part: Core Rules
      "class-methods-use-this": "error",
      curly: "warn",
      "default-param-last": "error",
      "dot-notation": "error",
      "line-comment-position": "error",
      "logical-assignment-operators": "error",
      "max-depth": "warn",
      "max-lines": "warn",
      "max-params": "warn",
      "max-statements": "warn",
      "no-alert": "error",
      "no-await-in-loop": "error",
      "no-console": "warn",
      "no-constant-binary-expression": "error",
      "no-else-return": [
        "error",
        {
          allowElseIf: false,
        },
      ],
      "no-lonely-if": "error",
      "no-loop-func": "error",
      "no-magic-numbers": ["error", noMagicNumbersOptions],
      "no-promise-executor-return": "error",
      "no-self-compare": "error",
      "no-shadow": "error",
      "no-template-curly-in-string": "warn",
      "no-throw-literal": "off",
      "no-unmodified-loop-condition": "error",
      "no-unneeded-ternary": "error",
      "no-unreachable-loop": "error",
      "no-unused-expressions": "error",
      "no-unused-private-class-members": "error",
      "no-use-before-define": "error",
      "no-useless-computed-key": "error",
      "no-useless-concat": "error",
      "no-useless-constructor": "error",
      "no-useless-rename": "error",
      "no-useless-return": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "operator-assignment": "error",
      "prefer-arrow-callback": "error",
      "prefer-const": "error",
      "prefer-destructuring": ["error", preferDestructuringOptions],
      "prefer-object-spread": "error",
      "prefer-promise-reject-errors": "error",
      "prefer-spread": "error",
      "require-await": "error",
    },
    settings,
  },
  {
    files: ["**/*.ts?(x)"],
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        project: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      etc: etcPlugin,
    },
    rules: {
      ...craConfig.overrides[0].rules,
      ...etcPlugin.configs.recommended.rules,
      "@typescript-eslint/class-methods-use-this": "error",
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/default-param-last": "error",
      "@typescript-eslint/max-params": "error",
      "@typescript-eslint/method-signature-style": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          format: ["strictCamelCase"],
          leadingUnderscore: "allow",
          selector: "default",
          trailingUnderscore: "allow",
        },
        {
          filter: { match: true, regex: "\\d+" },
          format: null,
          selector: "objectLiteralProperty",
        },
        {
          filter: { match: false, regex: "\\d+" },
          format: ["camelCase", "snake_case", "StrictPascalCase"],
          selector: "objectLiteralProperty",
        },
        {
          format: ["strictCamelCase", "StrictPascalCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
          selector: ["import", "function"],
        },
        {
          format: ["strictCamelCase", "UPPER_CASE", "StrictPascalCase"],
          leadingUnderscore: "allow",
          selector: "variable",
          trailingUnderscore: "allow",
        },
        {
          format: ["StrictPascalCase"],
          selector: "typeLike",
        },
        {
          format: ["PascalCase"],
          prefix: ["T"],
          selector: "typeParameter",
        },
        {
          format: null,
          selector: "typeProperty",
        },
      ],
      "@typescript-eslint/no-loop-func": "error",
      "@typescript-eslint/no-magic-numbers": ["error", noMagicNumbersOptions],
      "@typescript-eslint/non-nullable-type-assertion-style": "off",
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-unnecessary-qualifier": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unsafe-unary-minus": "error",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-use-before-define": "error",
      "@typescript-eslint/no-useless-empty-export": "error",
      "@typescript-eslint/prefer-destructuring": [
        "error",
        preferDestructuringOptions,
      ],
      "@typescript-eslint/prefer-find": "error",
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/restrict-plus-operands": "error",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowAny: false,
          allowBoolean: true,
          allowNever: false,
          allowNullish: false,
          allowNumber: true,
          allowRegExp: false,
        },
      ],
      "class-methods-use-this": "off",
      "default-param-last": "off",
      "etc/no-t": "error",
      "jsx-expressions/strict-logical-expressions": "error",
      "max-params": "off",
      "no-loop-func": "off",
      "no-magic-numbers": "off",
      "no-shadow": "off",
      "no-unused-expressions": "off",
      "no-use-before-define": "off",
      "prefer-destructuring": "off",
    },
  },
  {
    files: ["**/*.{cjs,js?(x),mjs}"],
    ...tsEslint.configs.disableTypeChecked,
  },
];
