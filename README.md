# wo-library

TypeScript monorepo for npm utility packages and a shadcn-style component registry.

Active work: **[`docs/plans/v3-plan.md`](docs/plans/v3-plan.md)**.

## Packages

| Package                                                                   | Description                                                  | Docs                                                 |
| ------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------- |
| [`@wo-library/js`](packages/js)                                           | Pure JS/TS utilities (no DOM/React)                          | [README](packages/js/README.md)                      |
| [`@wo-library/web`](packages/web)                                         | Browser/DOM utilities                                        | [README](packages/web/README.md)                     |
| [`@wo-library/node`](packages/node)                                       | Node-only utilities                                          | [README](packages/node/README.md)                    |
| [`@wo-library/oxlint-config`](packages/oxlint-config)                     | Shared oxlint presets                                        | [README](packages/oxlint-config/README.md)           |
| [`packages/registry`](packages/registry)                                  | shadcn registry source (hooks, lib, themes, ui) — not on npm | [README](packages/registry/README.md)                |
| [`@wo-library/eslint-config`](packages/eslint-config)                     | Shared ESLint flat-config presets                            | [README](packages/eslint-config/README.md)           |
| [`@wo-library/postcss-config`](packages/postcss-config)                   | Shared PostCSS configuration                                 | [README](packages/postcss-config/README.md)          |
| [`@wo-library/stylelint-config`](packages/stylelint-config)               | Shared Stylelint configuration                               | [README](packages/stylelint-config/README.md)        |
| [`@wo-library/semantic-release-config`](packages/semantic-release-config) | Semantic release presets                                     | [README](packages/semantic-release-config/README.md) |

**Docs:** https://tiwariav.github.io/wo-library/ (Storybook and API reference).

`@wo-library/react` and `@wo-library/ui` were removed in phase 0. Old code is tagged `legacy-v2`.

## Quick Start

```bash
pnpm install
pnpm nx run-many --target=build
pnpm nx run-many --target=test
pnpm storybook
```

## Import Pattern

```typescript
// Named exports only — no default imports
import { formatNumber, getFlagEmoji, describeArc } from "@wo-library/js";
import { loadScript, UploadFile } from "@wo-library/web";
```

Registry items are copied into apps with `npx shadcn add @wo/<item>`. Add the registry to `components.json` first:
`"registries": { "@wo": "https://tiwariav.github.io/wo-library/r/{name}.json" }`. Source lives under `packages/registry/`.

## Key Conventions

- **Named exports only** — default exports are not used in public APIs.
- **TypeScript strict mode** — no `any`; use `unknown`.
- **Indian number locale** — `formatNumber` uses `en-IN`.
- **`lodash-es`** — tree-shakeable ESM build only.
- **UI appearance** — Tailwind 4 + base-ui via the registry (not CSS Modules).

## Contributing

See [`.ai/instructions.md`](.ai/instructions.md) and [`docs/plans/v3-plan.md`](docs/plans/v3-plan.md).

## License

MIT
