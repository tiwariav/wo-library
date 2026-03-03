# wo-library AI Development Instructions

> This is the master source for AI assistant rules. All IDE-specific files are generated from this.

## Project Overview

**wo-library** is a TypeScript monorepo containing reusable JavaScript utilities and React components with minimal styling, designed to work with any design system.

## Package Structure

| Package                        | Purpose                             | Dependencies                                    |
| ------------------------------ | ----------------------------------- | ----------------------------------------------- |
| `@wo-library/js`               | Pure JS/TS utilities (no DOM/React) | lodash-es                                       |
| `@wo-library/react`            | React components, hooks, contexts   | @wo-library/js, @wo-library/web, @wo-library/ui |
| `@wo-library/web`              | Web/DOM utilities                   | @wo-library/js                                  |
| `@wo-library/ui`               | CSS styles, themes, design tokens   | @wo-library/web                                 |
| `@wo-library/eslint-config`    | Shared ESLint configuration         | -                                               |
| `@wo-library/postcss-config`   | Shared PostCSS configuration        | -                                               |
| `@wo-library/stylelint-config` | Shared Stylelint configuration      | -                                               |

## Development Commands

```bash
pnpm install              # Install dependencies
pnpm nx run-many -t build # Build all packages
pnpm nx run-many -t test  # Run all tests
pnpm --filter "@wo-library/react" storybook  # Start Storybook
pnpm --filter "@wo-library/react" test       # Test react package
```

---

## Coding Standards

### TypeScript

- **Strict mode required** - All packages use strict TypeScript
- **Explicit return types** - Functions should have explicit return types
- **No `any`** - Use `unknown` or proper types instead
- **Named exports only** - Do not use default exports

```typescript
// ✅ Correct
export function formatNumber(value: number): string { ... }
export interface FormatOptions { ... }

// ❌ Wrong
export default function formatNumber(value: number) { ... }
const formatNumber = (value: any) => { ... }
```

### React Components

- **Functional components only** - No class components
- **Props interface naming** - Use `{ComponentName}Props`
- **Forward refs** - Components accepting refs should use `forwardRef`
- **CSS Modules** - Use `*.module.css` for styling

```typescript
// ✅ Correct
export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children }: ButtonProps) {
  return <button className={styles[variant]}>{children}</button>;
}

// ❌ Wrong
export default class Button extends React.Component { ... }
```

### Imports

```typescript
// ✅ Correct - Named imports from package
import { formatNumber, range } from '@wo-library/js';
import { Button, TextInput } from '@wo-library/react';
import { useStateWithProp } from '@wo-library/react';

// ❌ Wrong - Deep imports or namespace imports
import formatNumber from '@wo-library/js/tools/number';
import * as woJs from '@wo-library/js';
```

---

## Key Conventions

### Number Formatting (Indian Locale)

This library uses **Indian locale (en-IN)** for number formatting:

```typescript
import { formatNumber, formatNumberWithSuffix } from '@wo-library/js';

formatNumber(1234567);           // "12,34,567.00"
formatNumber(1234.5, { fractionDigits: 0 }); // "1,235"

formatNumberWithSuffix(1500);        // "1,500"
formatNumberWithSuffix(150000);      // "1.5 L"    (Lakhs)
formatNumberWithSuffix(15000000);    // "1.5 Cr"   (Crores)
```

### Atomic Design Pattern

Components follow atomic design hierarchy:

```
components/
├── atoms/        # Basic building blocks (Button, Input, Text, Image)
├── molecules/    # Composite components (CardLink, Popover)
├── structures/   # Complex layouts (FormGroup, Hero, Navigation)
└── templates/    # Page-level components
```

### File Organization

```
packages/
├── js/src/tools/           # Pure utility functions
├── react/src/
│   ├── components/         # React components (atomic design)
│   ├── hooks/              # Custom React hooks
│   ├── contexts/           # React contexts
│   └── tools/              # React-specific utilities
├── web/src/tools/          # DOM/browser utilities
└── ui/src/
    ├── styles/             # Global CSS
    └── themes/             # Theme definitions
```

---

## When Creating New Code

### Creating a Utility Function

1. **Location**: `packages/js/src/tools/` for pure functions, `packages/web/src/tools/` for DOM utilities
2. **Documentation**: Add JSDoc with `@param`, `@returns`, and `@example`
3. **Export**: Add to the appropriate `index.ts` barrel file
4. **Tests**: Add tests in `__tests__/` folder

```typescript
/**
 * Calculates the sum of an array of numbers.
 * 
 * @param numbers - Array of numbers to sum
 * @returns The total sum
 * 
 * @example
 * ```typescript
 * sum([1, 2, 3, 4]); // 10
 * sum([]); // 0
 * ```
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}
```

### Creating a React Component

1. **Location**: `packages/react/src/components/{level}/{ComponentName}/`
2. **Files needed**:
   - `{ComponentName}.tsx` - Component implementation
   - `{componentName}.module.css` - Styles
   - `index.ts` - Barrel export
3. **Documentation**: JSDoc on component and props interface
4. **Export**: Add to parent `index.ts`
5. **Story**: Add Storybook story with `autodocs` tag

```typescript
// packages/react/src/components/atoms/Badge/Badge.tsx
import styles from './badge.module.css';

/**
 * A small status indicator badge.
 * 
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning">Pending</Badge>
 * ```
 */
export interface BadgeProps {
  /** Visual style variant */
  variant?: 'default' | 'success' | 'warning' | 'error';
  /** Badge content */
  children: React.ReactNode;
}

export function Badge({ variant = 'default', children }: BadgeProps) {
  return <span className={clsx(styles.badge, styles[variant])}>{children}</span>;
}
```

### Creating a React Hook

1. **Location**: `packages/react/src/hooks/`
2. **Naming**: Prefix with `use` (e.g., `useLocalStorage`)
3. **Documentation**: JSDoc with usage example
4. **Export**: Add to `hooks/index.ts`

```typescript
/**
 * Syncs state with a prop value, updating when the prop changes.
 * 
 * @param prop - The prop value to sync with
 * @returns Stateful value and setter
 * 
 * @example
 * ```tsx
 * function Counter({ initialCount }: { initialCount: number }) {
 *   const [count, setCount] = useStateWithProp(initialCount);
 *   return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
 * }
 * ```
 */
export function useStateWithProp<T>(prop: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState(prop);
  useEffect(() => setState(prop), [prop]);
  return [state, setState];
}
```

---

## Testing Guidelines

- **Framework**: Jest with `@jest/globals`
- **React Testing**: `@testing-library/react`
- **Location**: `__tests__/` folders alongside source
- **Naming**: `{filename}.test.ts` or `{filename}.test.tsx`

```typescript
import { describe, it, expect } from '@jest/globals';
import { formatNumber } from '../number';

describe('formatNumber', () => {
  it('formats integers with Indian locale separators', () => {
    expect(formatNumber(1234567)).toBe('12,34,567.00');
  });

  it('handles invalid input gracefully', () => {
    expect(formatNumber('invalid')).toBe('');
    expect(formatNumber('invalid', { nullValue: 'N/A' })).toBe('N/A');
  });
});
```

---

## Dependencies

### Production Dependencies (use these)
- `lodash-es` - Utility functions (tree-shakeable)
- `clsx` - Conditional class names
- `react-hook-form` - Form state management
- `@floating-ui/react` - Popovers and tooltips

### Avoid
- `lodash` - Use `lodash-es` instead (tree-shakeable)
- `moment` - Use native Date or date-fns
- `styled-components` - Use CSS Modules instead

---

## Common Tasks

### Adding a new export to a package
1. Create the function/component with JSDoc
2. Export from the module's `index.ts`
3. Verify build: `pnpm --filter "@wo-library/{package}" build`

### Running tests for a specific package
```bash
pnpm --filter "@wo-library/react" test
pnpm --filter "@wo-library/js" test
```

### Building a specific package
```bash
pnpm --filter "@wo-library/react" build
pnpm --filter "@wo-library/js" build
```

### Starting Storybook
```bash
pnpm --filter "@wo-library/react" storybook
```

---

## Additional Reference Documents

| File                    | Purpose                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| `ARCHITECTURE.md`       | Detailed architecture: package relationships, component design, state patterns, styling     |
| `ai-context.json`       | Machine-readable metadata for AI agents (package exports, patterns, component descriptions) |
| `docs/AI_AGENT_PLAN.md` | Documentation improvement roadmap and progress tracking                                     |
