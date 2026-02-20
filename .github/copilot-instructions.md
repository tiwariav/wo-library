# wo-library - GitHub Copilot Instructions

**IMPORTANT**: Read and follow all guidelines in `/.ai/instructions.md` - that file contains the complete coding standards for this project.

## Quick Reference

This is a TypeScript monorepo with 4 main packages:

- `@wo-library/js` - Pure JS/TS utilities
- `@wo-library/react` - React components & hooks
- `@wo-library/web` - Web/DOM utilities
- `@wo-library/ui` - CSS styles & themes

## Critical Rules

1. **Named exports only** - Never use default exports
2. **TypeScript strict mode** - No `any` types, use `unknown`
3. **JSDoc required** - All public APIs need `@param`, `@returns`, `@example`
4. **CSS Modules** - Use `*.module.css`, no inline styles
5. **lodash-es** - Use tree-shakeable version, not `lodash`
6. **Indian locale** - Number formatting uses `en-IN` (Lakhs/Crores)

## Import Pattern

```typescript
// ✅ Correct
import { formatNumber } from "@wo-library/js";
import { Button } from "@wo-library/react";

// ❌ Wrong
import formatNumber from "@wo-library/js/tools/number";
```

## See Also

- `/.ai/instructions.md` - Complete coding standards and patterns
- `/AI_AGENT_PLAN.md` - Documentation improvement roadmap
