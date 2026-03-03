# @wo-library/react

React components and hooks for building UIs with minimal, overridable styling.

## Installation

```bash
npm install @wo-library/react
# or
pnpm add @wo-library/react
```

## Components

Components follow **Atomic Design** and are organised into four tiers:

| Tier           | Examples                                                                         |
| -------------- | -------------------------------------------------------------------------------- |
| **Atoms**      | `Button`, `TextInput`, `Modal`, `Card`, `Image`, `Spinner`, `Select`, `Checkbox` |
| **Molecules**  | `CardLink`, `Popover`                                                            |
| **Structures** | Layout compositions built from atoms and molecules                               |
| **Templates**  | Full-page templates                                                              |

All component styles use CSS Modules (`*.module.css`) — no inline styles.

## Hooks

| Hook                 | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| `useCalendly`        | Loads Calendly SDK and returns a function to open the popup widget |
| `useMethods`         | Type-safe `useReducer` alternative with named action methods       |
| `useScrollDirection` | Tracks scroll direction (`"up"` / `"down"`) on window or a ref     |
| `useStateWithProp`   | Keeps local state synced with a changing prop value                |

### Internal hooks (not re-exported)

| Hook              | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| `usePropRef`      | Merges multiple forwarded refs into one internal ref         |
| `useMeasureInput` | Measures a label to compute input padding/height adjustments |

## Contexts

| Context         | Description                            |
| --------------- | -------------------------------------- |
| `ChartContext`  | Shared state for chart components      |
| `LayoutContext` | Layout dimensions and breakpoint state |
| `ScrollContext` | Scroll position state                  |
| `ThemeContext`  | Theme switching                        |

## Usage

```tsx
import { useCalendly, useMethods } from "@wo-library/react";

// Type-safe reducer with named methods
const [count, { increment, decrement }] = useMethods(
  (state) => ({
    increment: () => state + 1,
    decrement: () => state - 1,
  }),
  0,
);
```

## Dependencies

- `react` / `react-dom` (peer)
- `react-use` — utility hooks
- `lodash-es` — tree-shakeable utilities
- `clsx` — class name composition
- `@wo-library/js`, `@wo-library/web`, `@wo-library/ui` (workspace peers)

## License

MIT
