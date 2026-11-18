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

## Lint strategy

1. **Default / CI fast path:** oxlint with type-aware (`pnpm lint:oxlint`).
2. **Keep eslint** as a slower gate until unicorn / typescript-eslint gaps close — or trim eslint to
   only rules oxlint cannot run.
3. **lint-staged:** prefer oxlint on staged TS/TSX; leave eslint for broader PR CI while the gap
   list is long.

## Coverage gaps vs eslint-config

From `@oxlint/migrate` against this repo's ESLint flat config (oxlint 1.94):

| Status | Count | Action |
| --- | ---: | --- |
| Migrated | 723 | Covered by oxlint presets |
| Not implemented | 175 | Keep eslint (mostly `unicorn/*`) — full table in [GAPS.md](./GAPS.md) |
| Unsupported | 28 | Skip; superseded or covered by oxc/TS — table in [GAPS.md](./GAPS.md) |
| Nursery (skipped) | 6 | Opt-in later with `--with-nursery` |

Refresh `GAPS.md` when bumping oxlint or eslint-config plugins:

```bash
pnpm exec migrate eslint.config.mjs --type-aware --details
```

Do not commit the regenerated root `.oxlintrc.json` from that command; this package's presets are the source of truth.
