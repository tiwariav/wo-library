import eslintReact from "@eslint-react/eslint-plugin";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import craConfig from "eslint-config-react-app";
import compatPlugin from "eslint-plugin-compat";
import formatjsPlugin from "eslint-plugin-formatjs";
import jest from "eslint-plugin-jest";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import lodashPlugin from "eslint-plugin-lodash";
import perfectionist from "eslint-plugin-perfectionist";
import sonarjsPlugin from "eslint-plugin-sonarjs";
import testingLibraryPlugin from "eslint-plugin-testing-library";
import unicorn from "eslint-plugin-unicorn";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tsEslint from "typescript-eslint";

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

export default defineConfig([
  js.configs.recommended,
  ...tsEslint.configs.strictTypeChecked.map((config) => ({
    ...config,
    files: ["**/*.ts?(x)"],
  })),
  ...tsEslint.configs.stylisticTypeChecked.map((config) => ({
    ...config,
    files: ["**/*.ts?(x)"],
  })),
  compatPlugin.configs["flat/recommended"],
  eslintReact.configs["recommended-typescript"],
  prettier,
  unicorn.configs["flat/recommended"],
  jest.configs["flat/recommended"],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      formatjs: formatjsPlugin,
      "jsx-a11y": jsxA11yPlugin,
      lodash: lodashPlugin,
      perfectionist,
      sonarjs: sonarjsPlugin,
      "testing-library": testingLibraryPlugin,
      unicorn,
    },
    rules: {
      ...jsxA11yPlugin.configs.recommended.rules,
      ...lodashPlugin.configs.recommended.rules,
      ...sonarjsPlugin.configs.recommended.rules,
      ...testingLibraryPlugin.configs.react.rules,
      ...removeKeysStartingWith(craConfig.rules, [
        "flowtype/",
        "import/",
        "react/",
        "react-hooks/",
      ]),
      "@eslint-react/exhaustive-deps": "error",
      "@eslint-react/no-nested-component-definitions": "error",
      "@eslint-react/no-unstable-context-value": "error",
      "@eslint-react/no-useless-fragment": "error",
      "@eslint-react/rules-of-hooks": "error",
      "class-methods-use-this": "error",
      curly: "warn",
      "default-param-last": "error",
      "dot-notation": "error",
      "jest/expect-expect": [
        "error",
        {
          assertFunctionNames: ["expect", "expectResult"],
        },
      ],
      "jsx-a11y/anchor-ambiguous-text": "warn",
      "jsx-a11y/no-autofocus": "off",
      "jsx-a11y/prefer-tag-over-role": "warn",
      "line-comment-position": "error",
      "lodash/import-scope": ["error", "member"],
      "lodash/prefer-lodash-method": "off",
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
      "perfectionist/sort-objects": [
        "error",
        {
          partitionByComment: "^Part:.*",
        },
      ],
      "prefer-arrow-callback": "error",
      "prefer-const": "error",
      "prefer-destructuring": ["error", preferDestructuringOptions],
      "prefer-object-spread": "error",
      "prefer-promise-reject-errors": "error",
      "prefer-spread": "error",
      "require-await": "error",
      "sonarjs/cognitive-complexity": "error",
      "sonarjs/no-inverted-boolean-check": "warn",
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
      "unicorn/no-nested-ternary": "off",
      "unicorn/no-null": "off",
      "unicorn/no-unused-properties": "error",
      "unicorn/number-literal-case": "off",
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
    rules: {
      ...removeKeysStartingWith(craConfig.overrides[0].rules, [
        "react/",
        "react-hooks/",
      ]),
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
          filter: { match: true, regex: String.raw`\d+` },
          format: null,
          selector: "objectLiteralProperty",
        },
        {
          filter: { match: false, regex: String.raw`\d+` },
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
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-unnecessary-qualifier": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/no-unsafe-unary-minus": "error",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-use-before-define": "error",
      "@typescript-eslint/no-useless-empty-export": "error",
      "@typescript-eslint/non-nullable-type-assertion-style": "off",
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
    files: ["**/__tests__/**/*.{ts,tsx}", "**/*.{spec,test}.{ts,tsx}"],
    ...tsEslint.configs.disableTypeChecked,
  },
  {
    files: [
      "**/eslint.config.{js,cjs,mjs}",
      "**/*.config.{js,cjs,mjs}",
      "**/rollup.config.js",
      "**/babel.config.cjs",
      "**/jest.config.{js,cjs}",
    ],
    ...tsEslint.configs.disableTypeChecked,
  },
  {
    files: ["**/*.{cjs,js?(x),mjs}"],
    ...tsEslint.configs.disableTypeChecked,
  },
]);
