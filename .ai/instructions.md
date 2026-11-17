# wo-library AI Development Instructions

> Master source for AI assistant rules. IDE-specific files should stay aligned with this.

Active work: **[`docs/plans/v3-plan.md`](../docs/plans/v3-plan.md)**. Where this file disagrees with the plan, the plan wins until it is rewritten later in the rework.

## Project Overview

**wo-library** is a TypeScript monorepo of:

1. npm utility packages (`@wo-library/js`, `@wo-library/web`, later `node`)
2. a shadcn-style registry of hooks, lib helpers, themes, and UI (copied into apps)

## Package Structure

| Package | Purpose |
| --- | --- |
| `@wo-library/js` | Pure JS/TS utilities (no DOM/React) |
| `@wo-library/web` | Browser/DOM utilities |
| `packages/registry` | Registry source (hooks, lib, themes, ui) — not on npm |
| `@wo-library/eslint-config` | Shared ESLint configuration |
| `@wo-library/postcss-config` | Shared PostCSS configuration |
| `@wo-library/stylelint-config` | Shared Stylelint configuration |
| `@wo-library/semantic-release-config` | Semantic-release presets |

## Development Commands

```bash
pnpm install
pnpm nx run-many -t build
pnpm nx run-many -t test
pnpm storybook
pnpm --filter "@wo-library/js" test
pnpm --filter "@wo-library/web" test
```

---

## Coding Standards

### TypeScript

- **Strict mode required**
- **Explicit return types**
- **No `any`** — use `unknown` or proper types
- **Named exports only** — no default exports in public APIs

```typescript
export function formatNumber(value: number): string { ... }
export interface FormatOptions { ... }
```

### Imports

```typescript
import { formatNumber, range } from '@wo-library/js';
import { loadScript, UploadFile } from '@wo-library/web';
```

Do not deep-import package internals.

### Registry / UI

- New UI lives under `packages/registry/` as copy-paste items (Tailwind 4 + base-ui).
- Do **not** add CSS Modules or atomic-design trees under a published React package.
- Hooks and lib helpers that apps will own also live in the registry.

### Number Formatting (Indian Locale)

```typescript
import { formatNumber, formatNumberWithSuffix } from '@wo-library/js';

formatNumber(1234567);           // "12,34,567.00"
formatNumberWithSuffix(150000);  // "1.50 L"
```

### lodash-es

Always use `lodash-es`, never `lodash`.

---

## When Creating New Code

### Utility

1. `packages/js/src/tools/` (pure) or `packages/web/src/tools/` (browser)
2. JSDoc with `@param`, `@returns`, `@example`
3. Export from the package barrel
4. Tests in `__tests__/`

### Registry hook / lib / ui

1. Add under `packages/registry/{hooks,lib,ui,themes}/`
2. Named exports
3. Storybook story under the same package
4. Phase 4 wires `registry.json` and `shadcn build`

---

## Testing

- **Framework (today)**: Jest with `@jest/globals` (Vitest in phase 1)
- **Location**: `__tests__/` beside source
- **Naming**: `{filename}.test.ts(x)`

---

## Additional Reference

| File | Purpose |
| --- | --- |
| `docs/plans/v3-plan.md` | Active rework plan + progress log |
| `ARCHITECTURE.md` | Package layout and dependency rules |
| `ai-context.json` | Machine-readable package metadata |
| `AGENTS.md` | Agent entry point |
