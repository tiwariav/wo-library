# wo-library - GitHub Copilot Instructions

**IMPORTANT**: Follow `/.ai/instructions.md` and the active plan in `/docs/plans/v3-plan.md`.

## Quick Reference

- `@wo-library/js` — pure JS/TS utilities
- `@wo-library/web` — browser/DOM utilities
- `packages/registry` — shadcn registry source (hooks, lib, themes, ui); not on npm
- Shared configs: eslint-config, postcss-config, stylelint-config, semantic-release-config

`@wo-library/react` and `@wo-library/ui` are removed (see tag `legacy-v2`).

## Critical Rules

1. **Named exports only**
2. **TypeScript strict** — no `any`
3. **JSDoc** on public APIs
4. **No CSS Modules / atomic-design package** — UI is registry + Tailwind 4 + base-ui
5. **lodash-es** only
6. **Indian locale** for number formatting (`en-IN`)

## Import Pattern

```typescript
import { formatNumber } from "@wo-library/js";
import { UploadFile, loadScript } from "@wo-library/web";
```

## See Also

- `/.ai/instructions.md`
- `/ARCHITECTURE.md`
- `/docs/plans/v3-plan.md`
- `/ai-context.json`
