# wo-library — Architecture

Internal architecture for developers and AI agents. Active rework:
[`docs/plans/v3-plan.md`](docs/plans/v3-plan.md).

## Monorepo Layout

```
wo-library/
├── packages/
│   ├── js/                      # @wo-library/js      — pure utilities
│   ├── web/                     # @wo-library/web     — browser utilities
│   ├── registry/                # shadcn registry source (not on npm)
│   ├── storybook/               # Storybook host
│   ├── eslint-config/
│   ├── postcss-config/
│   ├── stylelint-config/
│   └── semantic-release-config/
├── .ai/instructions.md
├── docs/plans/v3-plan.md
└── nx.json
```

## Package Dependency Graph

```
@wo-library/js          (no internal deps)
@wo-library/web         may use @wo-library/js
@wo-library/registry    uses @wo-library/js / @wo-library/web where needed
```

**Rule**: Import from the package boundary, never deep internal paths.

```typescript
import { formatNumber } from "@wo-library/js";
import { loadScript, UploadFile } from "@wo-library/web";
```

## @wo-library/js — Pure Utilities

Environment-agnostic TypeScript utilities. No browser or React dependencies.

Notable modules under `src/tools/`: `array`, `colors`, `number` (en-IN), `phone`
(`getFlagEmoji`), `progress` (arc/circle geometry), `svg` (`describeArc`, pin/flag
paths), `objects`, `path`, `language`, `misc`.

## @wo-library/web — Browser Utilities

DOM, network, and storage helpers: fetch wrappers, `loadScript` /
`loadStylesheet`, storage helpers, CSS variable helpers, and `UploadFile`.

## packages/registry — shadcn Registry Source

Not published to npm. Consumers will copy items with `npx shadcn add @wo/<item>`
after phase 4 publishes the built registry.

| Path | Kind |
| --- | --- |
| `hooks/` | `registry:hook` (useMethods, useLocalStorage, …) |
| `lib/` | `registry:lib` (`createAndUseContext`, …) |
| `themes/` | `registry:theme` (fresh, trusty `@theme` tokens) |
| `ui/` | `registry:ui` (added in phase 4) |

## Config Packages

Shared ESLint, PostCSS, Stylelint, and semantic-release presets remain. Oxlint
config is added in phase 2.

## Storybook

`packages/storybook` hosts stories for `web` and `registry`. Phase 1 moves it to
Vite + Tailwind 4.

## Legacy

`@wo-library/react` and `@wo-library/ui` were removed in phase 0. Reach the old
tree via the `legacy-v2` git tag. Salvage inventory:
[`docs/plans/v3-phase0-salvage.md`](docs/plans/v3-phase0-salvage.md).
