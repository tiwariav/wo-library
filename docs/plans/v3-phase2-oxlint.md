# Phase 2: oxlint vs eslint

Generated while creating `@wo-library/oxlint-config` from the repo ESLint flat config via
`pnpm exec migrate eslint.config.mjs --type-aware --details` (oxlint / `@oxlint/migrate` 1.94.0).

## Speed

On `packages/js/src`, `packages/web/src`, and `packages/registry` (same machine, cold-ish cache):

| Tool | Wall time | Result |
| --- | --- | --- |
| `oxlint` (type-aware on) | ~7.3s | 12 findings before fixes; 7 warnings after |
| `eslint --quiet` | ~20.7s | 55 errors |

Oxlint was about **3× faster** on this slice. Absolute numbers will move with cache warmth and
`oxlint-tsgolint` cold start.

## Real bugs / cleanups oxlint found

Fixed in this phase:

- `sonarjs/prefer-native-lodash-alternative`: `isArray` → `Array.isArray` in `objects.ts` and
  `usePropRef.ts`.
- Unicorn numeric-separator style in a test fixture (suppressed with a line comment after checking
  value semantics).
- Confirmed `unicorn/prefer-number-coercion` would have changed `Number.parseFloat("")` →
  `Number("")` (NaN → 0) and broken `formatNumber` / `formatNumberWhileTyping`. Left as
  `parseFloat` with an oxlint disable.

Remaining oxlint **warnings** (not treated as blockers): React 19 suggestions around
`forwardRef` / `useContext` / `Context.Provider`, `set-state-in-effect` in `useStateWithProp`, and
kebab-case Storybook filename `web-overview.stories.tsx`.

## Rules that disagree

### Migrated but ESLint still reports more

ESLint 10 + unicorn 80 still flags many rules that `@oxlint/migrate` listed as **Not Implemented**
(183) or **Unsupported** (28). Examples that showed up in the eslint quiet run but not oxlint:

- `unicorn/consistent-boolean-name`
- `unicorn/no-computed-property-existence-check`
- `unicorn/no-unnecessary-global-this`
- `unicorn/prefer-location-assign`
- `unicorn/prefer-simple-condition-first`
- `unicorn/custom-error-definition` (options-parameter shape)

So oxlint is a fast subset, not a drop-in replacement for the full eslint-config surface yet.

### ESLint-only config noise

- `@eslint-react/component-hook-factories` “rule not found” on suppressions in
  `createAndUseContext.tsx` — eslint plugin version drift / renamed rule.
- Storybook `src/` is ignored by eslint; oxlint still sees package stories under `web` /
  `registry`.

### Oxlint-only / JS plugins

- `jsPlugins` (compat, `@eslint-react`, lodash, sonarjs, testing-library, perfectionist) must be
  declared on the **root** `.oxlintrc.json`; they do not ride along through `extends`.
- `react.version: "detect"` is unsupported; presets use an explicit `19.0.0`.
- `lintAllEsApis` compat setting was not migrated.

### Type-aware

- Type-checked typescript-eslint rules live in `type-aware.json` overrides.
- Requires optional peer `oxlint-tsgolint` and `options.typeAware: true` on the root config.
- Nursery type-aware rules (`@typescript-eslint/no-unnecessary-condition`,
  `prefer-optional-chain`, …) were skipped by migrate unless `--with-nursery`.

## Recommendation

1. **CI / local `lint` target**: run **oxlint** (with type-aware) on `js`, `web`, `registry`, and
   storybook package sources as the fast default.
2. **Keep eslint** for a while as a slower gate (or periodic job) until unicorn/typescript coverage
   gaps close — or trim eslint to only rules oxlint cannot run. The living tables live in
   [`packages/oxlint-config/GAPS.md`](../../packages/oxlint-config/GAPS.md) (summary also in the
   oxlint-config README).
3. **lint-staged**: prefer `oxlint` on staged TS/TSX for speed; leave eslint for broader PR CI
   until the disagreement list is short.

This matches the v3 plan: oxlint-config owns the shared presets; the repo `.oxlintrc.json`
composes them and owns `jsPlugins` + `options.typeAware`.
