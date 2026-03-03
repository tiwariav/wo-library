# AI Agent Usability Plan for wo-library

This document outlines a comprehensive plan to make the **wo-library** monorepo more effectively usable by AI agents (GitHub Copilot, Claude, GPT, Cursor, etc.).

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Documentation Strategy](#documentation-strategy)
4. [Code Discoverability](#code-discoverability)
5. [Type Safety & Inference](#type-safety--inference)
6. [Testing & Examples](#testing--examples)
7. [API Reference Generation](#api-reference-generation)
8. [Metadata & Context Files](#metadata--context-files)
9. [IDE-Specific AI Configuration](#ide-specific-ai-configuration)
10. [Implementation Roadmap](#implementation-roadmap)

---

## Executive Summary

AI agents work best when code is:


- **Well-documented** with clear intent and usage examples
- **Type-safe** with comprehensive TypeScript definitions
- **Discoverable** with consistent naming and organization
- **Contextual** with metadata files that describe purpose and relationships


This plan transforms wo-library into an AI-friendly codebase that enables agents to:

- Quickly understand package purposes and capabilities
- Generate accurate code using library components
- Provide correct usage examples and recommendations
- Navigate the codebase efficiently

---

## Current State Analysis

### Package Overview

| Package                               | Purpose                  | Documentation Status | AI Readiness |
| ------------------------------------- | ------------------------ | -------------------- | ------------ |
| `@wo-library/js`                      | Pure JS/TS utilities     | ✅ Good README        | 🟡 Medium     |
| `@wo-library/react`                   | React components & hooks | ❌ Minimal README     | 🔴 Low        |
| `@wo-library/ui`                      | UI styles & themes       | ❌ No README          | 🔴 Low        |
| `@wo-library/web`                     | Web utilities            | ❌ No README          | 🔴 Low        |
| `@wo-library/eslint-config`           | ESLint configuration     | ✅ Good README        | 🟢 High       |
| `@wo-library/postcss-config`          | PostCSS configuration    | ❌ Minimal README     | 🔴 Low        |
| `@wo-library/stylelint-config`        | Stylelint configuration  | ❌ Minimal README     | 🔴 Low        |
| `@wo-library/semantic-release-config` | Release automation       | ❌ Minimal README     | 🔴 Low        |

### Key Issues for AI Agents

1. **Sparse Documentation**: Most packages lack comprehensive READMEs
2. **Missing JSDoc Comments**: Functions lack inline documentation
3. **No Usage Examples**: Limited code samples in documentation
4. **No API Reference**: No auto-generated API documentation
5. **Missing Context Files**: No `.github/copilot-instructions.md` or similar

---

## Documentation Strategy

### 1. Package-Level READMEs

Each package should have a comprehensive README with:

```markdown
# @wo-library/{package-name}

## Overview
Brief description of what this package does and when to use it.

## Installation
pnpm installation commands.

## Quick Start
Minimal example to get started.

## API Reference
### Functions/Components
- Name
- Description
- Parameters with types
- Return value
- Usage example

## Dependencies
What this package depends on and peer dependencies.

## Related Packages
Links to related packages in the monorepo.
```

### 2. JSDoc Comments for All Exports

Every exported function, component, hook, and type should have JSDoc:

```typescript
/**
 * Formats a number using Indian locale (en-IN) with customizable fraction digits.
 * 
 * @param value - The number or string to format
 * @param options - Formatting options
 * @param options.fractionDigits - Number of decimal places (default: 2)
 * @param options.nullValue - Value to return for invalid input (default: "")
 * @returns Formatted number string or nullValue if invalid
 * 
 * @example
 * ```typescript
 * formatNumber(1234567.89); // "12,34,567.89"
 * formatNumber(1000, { fractionDigits: 0 }); // "1,000"
 * formatNumber("invalid"); // ""
 * ```
 */
export function formatNumber(
  value: number | string,
  options?: FormatNumberOptions
): string { ... }
```

### 3. Component Documentation

For React components, use structured documentation:

```typescript
/**
 * A flexible button component with multiple variants and sizes.
 * 
 * @component
 * @category Atoms
 * 
 * @example
 * ```tsx
 * // Primary button
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * 
 * // Loading state
 * <Button loading disabled>
 *   Processing...
 * </Button>
 * ```
 */
export interface ButtonProps {
  /** The visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Shows loading spinner */
  loading?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Button content */
  children: React.ReactNode;
}
```

---

## Code Discoverability

### 1. Barrel Files with Comments

Update index.ts files to include category comments:

```typescript
// @wo-library/js/src/tools/index.ts

// Array manipulation utilities
export * from "./array.js";

// Color conversion and manipulation
export * from "./colors.js";

// Time and measurement constants
export * from "./constants/index.js";

// Text and language utilities (pluralization, etc.)
export * from "./language.js";

// General utility functions (wait, isEmpty, etc.)
export * from "./misc.js";

// Number formatting and conversion
export * from "./number.js";

// Object manipulation utilities
export * from "./objects.js";

// Path manipulation (posix paths, etc.)
export * from "./path.js";

// SVG-related utilities
export * from "./svg.js";

// General purpose utilities
export * from "./utils.js";
```

### 2. Component Organization

Organize components with a clear taxonomy:

```
components/
├── atoms/           # Basic building blocks (Button, Input, Text)
│   ├── index.ts     # Barrel with categorized exports
│   └── README.md    # Atoms documentation
├── molecules/       # Composite components (Card, Modal)
│   ├── index.ts
│   └── README.md
├── structures/      # Complex layouts (Form, Navigation)
│   ├── index.ts
│   └── README.md
└── templates/       # Page-level components
    ├── index.ts
    └── README.md
```

### 3. Naming Conventions

Document and enforce consistent naming:

| Type       | Convention                       | Example                 |
| ---------- | -------------------------------- | ----------------------- |
| Components | PascalCase                       | `Button`, `TextInput`   |
| Hooks      | camelCase with `use` prefix      | `useStateWithProp`      |
| Contexts   | PascalCase with `Context` suffix | `ThemeContext`          |
| Utilities  | camelCase                        | `formatNumber`, `range` |
| Types      | PascalCase                       | `FormatNumberOptions`   |
| Constants  | SCREAMING_SNAKE_CASE             | `CRORE`, `LAKH`         |

---

## Type Safety & Inference

### 1. Strict TypeScript Configuration

Ensure `tsconfig.json` has strict settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### 2. Export All Types

Ensure all types are explicitly exported:

```typescript
// Export types alongside implementations
export type { FormatNumberOptions, FormatNumberSuffixOptions, NumberLike };
export { formatNumber, formatNumberWithSuffix, ordinalNumber, stringToNumber };
```

### 3. Generic Type Parameters

Use meaningful generic names with constraints:

```typescript
// Good: Clear generic names with constraints
export function getNestedValue<TResponse = string>(
  data: Record<string, unknown>,
  key: string
): TResponse | TResponse[];

// Good: Descriptive generic for collections
export function addOrUpdate<TItem extends Record<string, unknown>>(
  array: TItem[],
  object: TItem,
  key: keyof TItem
): TItem[];
```

---

## Testing & Examples

### 1. Test Files as Documentation

Structure tests to serve as usage examples:

```typescript
// number.test.ts

describe('formatNumber', () => {
  describe('basic formatting', () => {
    it('formats integers with Indian locale separators', () => {
      expect(formatNumber(1234567)).toBe('12,34,567.00');
    });

    it('formats decimals with specified precision', () => {
      expect(formatNumber(1234.5678, { fractionDigits: 2 })).toBe('1,234.57');
    });
  });

  describe('edge cases', () => {
    it('handles string numbers', () => {
      expect(formatNumber('1234.56')).toBe('1,234.56');
    });

    it('returns nullValue for invalid input', () => {
      expect(formatNumber('invalid', { nullValue: 'N/A' })).toBe('N/A');
    });
  });
});
```

### 2. Storybook Stories

Enhance stories with detailed documentation:

```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
A versatile button component supporting multiple variants, sizes, and states.

## When to use
- Primary actions in forms and dialogs
- Navigation triggers
- Confirmation/cancellation actions

## Accessibility
- Supports keyboard navigation
- ARIA attributes for loading states
- Focus visible styling
        `,
      },
    },
  },
  argTypes: {
    variant: {
      description: 'Visual style of the button',
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};
```

---

## API Reference Generation

### 1. TypeDoc Configuration

Add TypeDoc for automatic API documentation:

```json
// typedoc.json
{
  "entryPoints": [
    "packages/js/src/index.ts",
    "packages/react/src/index.ts",
    "packages/web/src/index.ts",
    "packages/ui/src/index.ts"
  ],
  "out": "docs/api",
  "plugin": ["typedoc-plugin-markdown"],
  "readme": "README.md",
  "categorizeByGroup": true,
  "categoryOrder": ["Functions", "Components", "Hooks", "Types", "*"]
}
```

### 2. Package Scripts

Add documentation generation scripts:

```json
{
  "scripts": {
    "docs": "typedoc",
    "docs:watch": "typedoc --watch"
  }
}
```

---

## Metadata & Context Files

### 1. GitHub Copilot Instructions

Create `.github/copilot-instructions.md`:

```markdown
# wo-library Copilot Instructions

## Project Overview
wo-library is a monorepo containing reusable JavaScript/TypeScript utilities and React components.

## Package Structure
- `@wo-library/js` - Pure JS utilities (array, number, object manipulation)
- `@wo-library/react` - React components, hooks, and contexts
- `@wo-library/ui` - UI styles and themes
- `@wo-library/web` - Web-specific utilities

## Code Style
- Use TypeScript with strict mode
- Prefer functional components over class components
- Use named exports over default exports
- Follow atomic design (atoms → molecules → structures → templates)

## Common Patterns

### Number Formatting (Indian locale)
```typescript
import { formatNumber, formatNumberWithSuffix } from '@wo-library/js';
formatNumber(1234567); // "12,34,567.00"

```


### React Hooks


```typescript
import { useStateWithProp, useMethods } from '@wo-library/react';

```


### Components

```typescript

import { Button, TextInput, Modal } from '@wo-library/react';
```


## Dependencies

- React 18+
- lodash-es for utility functions
- react-hook-form for form handling

```

### 2. AI Context File

Create `ai-context.json` in root:

```json
{
  "name": "wo-library",
  "description": "React component library with JavaScript utilities",
  "packages": {
    "@wo-library/js": {
      "description": "Pure JavaScript/TypeScript utilities",
      "exports": ["range", "addOrUpdate", "formatNumber", "formatNumberWithSuffix", "ordinalNumber", "pushOrCreate", "getNestedValue", "wait", "isEmpty"]
    },
    "@wo-library/react": {
      "description": "React components, hooks, and contexts",
      "components": {
        "atoms": ["Button", "TextInput", "Modal", "Card", "Image", "Spinner"],
        "molecules": ["CardLink", "Popover"],
        "structures": ["FormGroup", "Hero"]
      },
      "hooks": ["useStateWithProp", "useMethods", "useScrollDirection", "useCalendly"],
      "contexts": ["ThemeContext", "ChartContext"]
    }
  },
  "conventions": {
    "components": "PascalCase",
    "hooks": "use* prefix",
    "utilities": "camelCase",
    "locale": "en-IN for number formatting"
  }
}
```

### 3. ARCHITECTURE.md

Create comprehensive architecture documentation:


```markdown
# wo-library Architecture


## Monorepo Structure

```

wo-library/

├── packages/
│   ├── js/              # Pure utilities (no DOM/React)

│   ├── web/             # Web utilities (DOM, browser APIs)
│   ├── ui/              # Styles, themes, CSS modules
│   ├── react/           # React components & hooks
│   ├── eslint-config/   # Shared ESLint configuration
│   ├── postcss-config/  # Shared PostCSS configuration

│   └── stylelint-config/ # Shared Stylelint configuration

└── docs/                # Generated documentation

```

## Dependency Graph

```

@wo-library/react

    ├── @wo-library/js      (utilities)
    ├── @wo-library/web     (web utilities)
    └── @wo-library/ui      (styles)

@wo-library/web
    └── @wo-library/js


@wo-library/ui
    └── @wo-library/web

```

## Design Principles

1. **Minimal Styling**: Components provide structure, not opinionated styles
2. **Composition**: Small, composable units over monolithic components
3. **Type Safety**: Full TypeScript coverage with strict mode

4. **Tree Shakeable**: All exports are individual for optimal bundling
```

---

## IDE-Specific AI Configuration

### Single Source of Truth Architecture

This project uses **`.ai/instructions.md`** as the canonical rules file, with IDE-specific files referencing it. This approach:

- ✅ Eliminates rule duplication
- ✅ Ensures consistency across all AI assistants
- ✅ Makes maintenance easier
- ✅ AI agents read both files automatically

### File Structure

```
wo-library/
├── .ai/
│   └── instructions.md            # 📖 SINGLE SOURCE OF TRUTH
├── .github/
│   └── copilot-instructions.md    # VS Code Copilot (references .ai/instructions.md)
└── .cursorrules                   # Cursor IDE (references .ai/instructions.md)
```

### How It Works


1. **`.ai/instructions.md`** contains ALL coding standards, patterns, and conventions
2. **IDE-specific files** contain:
   - Quick reference summary
   - Critical rules (for immediate visibility)
   - Explicit instruction to read `.ai/instructions.md`

### Configuration Files

#### 1. .ai/instructions.md (Primary Rules)

This is the complete rules file. Contains:

- Project overview and package structure
- Development commands
- Code standards (MUST DO / MUST NOT)
- Import patterns and conventions
- Component, hook, and utility patterns
- Testing guidelines
- File location reference

#### 2. VS Code with GitHub Copilot

**File:** `.github/copilot-instructions.md`

```markdown
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

\`\`\`typescript
// ✅ Correct
import { formatNumber } from '@wo-library/js';
import { Button } from '@wo-library/react';

// ❌ Wrong
import formatNumber from '@wo-library/js/tools/number';
\`\`\`

## See Also

- `/.ai/instructions.md` - Complete coding standards and patterns
- `/docs/AI_AGENT_PLAN.md` - Documentation improvement roadmap
```

#### 3. Cursor IDE

**File:** `.cursorrules`

Uses identical content to `.github/copilot-instructions.md` (with adjusted title).

```markdown
# wo-library - Cursor IDE Rules

**IMPORTANT**: Read and follow all guidelines in `/.ai/instructions.md` - that file contains the complete coding standards for this project.

[... same content as copilot-instructions.md ...]
```

### Why This Works

| IDE                 | Files Read                             | Behavior                                                                  |
| ------------------- | -------------------------------------- | ------------------------------------------------------------------------- |
| **VS Code Copilot** | `.github/copilot-instructions.md`      | Sees instruction to read `.ai/instructions.md`, includes it automatically |
| **Cursor**          | `.cursorrules` + `.ai/instructions.md` | Reads both files, gets full context                                       |
| **Claude Code**     | `.ai/instructions.md`                  | Reads directly, full rules available                                      |

### Keeping Files in Sync

Since IDE files are nearly identical, you can use a simple script:

```bash
# scripts/sync-ai-rules.sh
#!/bin/bash

# Both files have same content except the title
cp .cursorrules .github/copilot-instructions.md
sed -i '' 's/Cursor IDE Rules/GitHub Copilot Instructions/' .github/copilot-instructions.md
echo "✓ AI rules synced"
```

Or maintain them manually (they're small enough that sync issues are unlikely).

```json
{
  "github.copilot.chat.codeGeneration.instructions": [
    {
      "text": "Use TypeScript strict mode. Use named exports. Follow atomic design for components."
    }
  ],
  "github.copilot.chat.testGeneration.instructions": [
    {
      "text": "Use Jest with @jest/globals. Use descriptive test names. Test edge cases."
    }
  ]
}
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

- [x] Create `.ai/instructions.md` (single source of truth)
- [x] Create `.github/copilot-instructions.md` (references .ai/instructions.md)
- [x] Create `.cursorrules` (references .ai/instructions.md)
- [x] Update root `README.md` with comprehensive overview
- [x] Add JSDoc comments to `@wo-library/js` utilities
- [x] Add category comments to barrel/index files
- [x] Create `ai-context.json`
- [x] Create `ARCHITECTURE.md`

### Phase 2: React Package (Week 3-4)

- [x] Add JSDoc comments to all hooks
- [x] Update `@wo-library/react` README
- [x] Add JSDoc comments to key component props interfaces (Button, TextInput, Modal, Card, Image, Text, Anchor, Tag, Container, Spinner, NumberInput)
- [x] Document contexts with usage examples (ThemeContext, LayoutContext, utils)
- [x] Add category comments to atoms barrel file
- [x] Add JSDoc to remaining atoms (Bookmark, CircleProgress, ArcProgress, FormGroup, etc.)
- [x] Create component README files for each category
- [x] Enhance Storybook stories with `autodocs`

### Phase 3: Supporting Packages (Week 5)

- [x] Document `@wo-library/web` utilities (JSDoc + README)
- [x] Document `@wo-library/ui` themes and styles (README)
- [x] Update config package READMEs (eslint, postcss, stylelint, semantic-release)

### Phase 4: Automation (Week 6)

- [x] Set up TypeDoc for API generation (`typedoc` + `typedoc-plugin-markdown`)
- [x] Add documentation CI/CD pipeline (`.github/workflows/docs.yml`)
- [x] Storybook as unified documentation site — TypeDoc markdown output integrated via stories glob

### Phase 5: Validation (Week 7)

- [ ] Test with GitHub Copilot in VS Code
- [ ] Test with Cursor IDE
- [ ] Gather feedback and iterate

---

## Success Metrics

1. **Discoverability**: AI can find appropriate utilities/components for a task
2. **Accuracy**: AI generates correct usage without hallucination
3. **Completeness**: AI includes proper imports and type annotations
4. **Context**: AI understands package relationships and dependencies

---

## Progress Summary

1. ✅ **Created `.ai/instructions.md`** - Complete coding standards (single source of truth)
2. ✅ **Created `.github/copilot-instructions.md`** - VS Code Copilot support
3. ✅ **Created `.cursorrules`** - Cursor IDE support
4. ✅ **JSDoc on all `@wo-library/js` utilities** - Every exported function/type documented
5. ✅ **JSDoc on all React hooks** - `useCalendly`, `useMethods`, `useScrollDirection`, `useStateWithProp`, `usePropRef`, `useMeasureInput`
6. ✅ **JSDoc on all `@wo-library/web` utilities** - fetch module, storage, error classes, CSS/SVG helpers, payments, routing
7. ✅ **Category comments on barrel files** - `@wo-library/js`, `@wo-library/web`, `@wo-library/react` hooks, atoms
8. ✅ **READMEs** - Root, `@wo-library/react`, `@wo-library/web`, `@wo-library/ui`
9. ✅ **JSDoc on key React component props** - Button, TextInput, Modal, Card, Image, Text, Anchor, Tag, Container, Spinner, NumberInput
10. ✅ **Context documentation** - ThemeContext, LayoutContext, context utils with JSDoc and usage examples
11. ✅ **`ARCHITECTURE.md`** - Full monorepo architecture document
12. ✅ **`ai-context.json`** - Machine-readable metadata for AI agents
13. ✅ **JSDoc on all remaining atoms** - Bookmark, ArcProgress, CircleProgress, Divider, ObserveInView, Hero, FormGroup, FormattedInput, LoaderWrapper, TextIcon, HookFormInputWrapper, Tooltip, Symbol, FileInput
14. ✅ **Config package READMEs** - `@wo-library/eslint-config`, `postcss-config`, `stylelint-config`, `semantic-release-config`
15. ✅ **Storybook autodocs** - `title` hierarchy added to all 33 story files (`Atoms/*`, `Molecules/*`, `Structures/*`, `Templates/*`); `controls.sort: 'requiredFirst'` set globally; `autodocs: true` already in `main.ts`
16. ✅ **Component category READMEs** - `atoms/README.md`, `molecules/README.md`, `structures/README.md`, `templates/README.md` (full component catalog with props and usage patterns)
17. ✅ **TypeDoc + Storybook integration** - `typedoc-plugin-markdown` generates `.mdx` API reference pages into `packages/storybook-host/src/docs/` (per-package `typedoc.json` configs for js/react/web/ui); root `typedoc.json` orchestrates all packages; `pnpm docs` command; generated files are gitignored
18. ✅ **Storybook as unified doc hub** - Stories glob extended to pick up TypeDoc-generated MDX pages alongside component stories; TypeDoc API pages appear under `API/` in Storybook sidebar
19. ✅ **GitHub Pages via Storybook** - `.github/workflows/docs.yml` replaced: builds packages → `pnpm docs` (TypeDoc) → `build-storybook` → deploys Storybook to GitHub Pages (single unified site)
20. ✅ **`ai-context.json` extended** - Added `documentation` section covering Storybook hub, TypeDoc workflow, stories globs, hierarchy, and CI pipeline
21. ✅ **Component-level story descriptions** - Added `parameters.docs.description.component` to all 33 story files (atoms, molecules, structures, templates) so Storybook autodocs pages display a component overview above the props table

---

## Resources

- [TypeDoc](https://typedoc.org/) - API documentation generator
- [Storybook Autodocs](https://storybook.js.org/docs/writing-docs/autodocs)
- [GitHub Copilot Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)
- [Cursor Rules Documentation](https://docs.cursor.com/context/rules-for-ai)
- [JSDoc Reference](https://jsdoc.app/)
