# wo-library

A professional library used to develop web and mobile applications.

## Packages

| Package                                                                   | Description                                                  | Docs                                                 |
| ------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| [`@wo-library/js`](packages/js)                                           | Pure JS/TS utilities (arrays, numbers, objects, colors, SVG) | [README](packages/js/README.md)                      |
| [`@wo-library/react`](packages/react)                                     | React components (atomic design) and hooks                   | [README](packages/react/README.md)                   |
| [`@wo-library/web`](packages/web)                                         | Browser/DOM utilities (fetch, storage, script loading)       | [README](packages/web/README.md)                     |
| [`@wo-library/ui`](packages/ui)                                           | CSS styles, themes, and SVG path data                        | [README](packages/ui/README.md)                      |
| [`@wo-library/eslint-config`](packages/eslint-config)                     | Shared ESLint flat-config presets                            | [README](packages/eslint-config/README.md)           |
| [`@wo-library/postcss-config`](packages/postcss-config)                   | Shared PostCSS configuration                                 | [README](packages/postcss-config/README.md)          |
| [`@wo-library/stylelint-config`](packages/stylelint-config)               | Shared Stylelint configuration                               | [README](packages/stylelint-config/README.md)        |
| [`@wo-library/semantic-release-config`](packages/semantic-release-config) | Semantic release presets                                     | [README](packages/semantic-release-config/README.md) |

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm nx run-many --target=build

# Run tests
pnpm nx run-many --target=test
```

## Import Pattern

```typescript
// Named exports only — no default imports
import { formatNumber, range } from "@wo-library/js";
import { useCalendly, useMethods } from "@wo-library/react";
import { loadScript, WoFetch } from "@wo-library/web";
```

## Key Conventions

- **Named exports only** — default exports are not used in public APIs.
- **TypeScript strict mode** — no `any` types; use `unknown` instead.
- **Indian number locale** — `formatNumber` uses `en-IN` (Lakhs/Crores).
- **CSS Modules** — component styles use `*.module.css`, never inline styles.
- **`lodash-es`** — always use the tree-shakeable ESM build, never `lodash`.

## Optimizations

### Providers

- When using `useMethods` from the `react-use` library, memoize the state argument before passing it to the function by wrapping in a `useMemo`, or the provider would return new state and methods every time, causing extra re-renders.

- Wrap the returned methods object in another `useMemo` so that it isn't treated as a new variable even when the state changes.

- Create two providers: one with the state values and the other with the dispatcher/methods values. Since the methods are fixed, components consuming only the methods will not re-render when the provider state changes.

## Contributing

See [`.ai/instructions.md`](.ai/instructions.md) for coding standards and patterns.

## License

MIT
