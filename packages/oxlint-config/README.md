# `@wo-library/oxlint-config`

Shared [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) presets for wo-library packages.

## Presets

| File | Purpose |
| --- | --- |
| `base.json` | Core + unicorn + typescript + import/oxc plugins, shared ignores |
| `react.json` | jsx-a11y + `@eslint-react` rules (JS plugins declared in the consumer root config) |
| `test.json` | jest/vitest plugins and test/story overrides |
| `type-aware.json` | TypeScript type-checked overrides for `oxlint --type-aware` / `oxlint-tsgolint` |

## Usage

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "extends": [
    "./node_modules/@wo-library/oxlint-config/base.json",
    "./node_modules/@wo-library/oxlint-config/react.json",
    "./node_modules/@wo-library/oxlint-config/test.json",
    "./node_modules/@wo-library/oxlint-config/type-aware.json"
  ],
  "jsPlugins": [
    "eslint-plugin-compat",
    "@eslint-react/eslint-plugin",
    "eslint-plugin-lodash",
    "eslint-plugin-sonarjs",
    "eslint-plugin-testing-library",
    "eslint-plugin-perfectionist"
  ],
  "options": {
    "typeAware": true
  }
}
```

`jsPlugins` and `options.typeAware` must live in the root config: Oxlint does not merge those fields through `extends`.

## Peer dependencies

- `oxlint` ^1.94
- `oxlint-tsgolint` (optional, for type-aware rules)
