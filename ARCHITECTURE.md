# wo-library — Architecture

This document describes the internal architecture of the `wo-library` monorepo for developers and AI agents authoring or modifying code.

---

## Monorepo Layout

```
wo-library/
├── packages/
│   ├── js/                   # @wo-library/js      — pure utilities
│   ├── react/                # @wo-library/react   — React UI library
│   ├── web/                  # @wo-library/web     — browser/DOM utilities
│   ├── ui/                   # @wo-library/ui      — CSS styles & themes
│   ├── eslint-config/        # @wo-library/eslint-config
│   ├── postcss-config/       # @wo-library/postcss-config
│   ├── stylelint-config/     # @wo-library/stylelint-config
│   ├── semantic-release-config/
│   └── storybook/              # Storybook development host
├── .ai/instructions.md       # AI coding standards (canonical)
├── .github/copilot-instructions.md
├── .cursorrules
├── docs/AI_AGENT_PLAN.md
└── nx.json                   # Nx workspace config
```

---

## Package Dependency Graph

```
@wo-library/js          (no internal deps)
@wo-library/web         depends on @wo-library/js
@wo-library/ui          depends on @wo-library/web
@wo-library/react       depends on @wo-library/js, @wo-library/web, @wo-library/ui
```

**Rule**: Always import from the package boundary, never from internal paths.

```typescript
// ✅ Correct
import { formatNumber } from "@wo-library/js";
import { loadScript } from "@wo-library/web";

// ❌ Wrong — bypasses the public API
import formatNumber from "@wo-library/js/src/tools/number";
```

---

## @wo-library/js — Pure Utilities

**Purpose**: Environment-agnostic TypeScript utilities. No browser or React dependencies.

```
src/tools/
├── array.ts        range(), addOrUpdate()
├── colors.ts       rgbToHex(), hexToRgb(), randomGradientGenerator()
├── constants/      INPUT_DEBOUNCE, etc.
├── language.ts     plularize()
├── misc.ts         wait()
├── number.ts       formatNumber(), formatNumberWithSuffix(), ordinalNumber(), stringToNumber()
├── objects.ts      pushOrCreate(), getNestedValue()
├── path.ts         posixPath()
├── svg.ts          polarToCartesian(), describeArc()
└── utils.ts        isEmpty(), inSubArray()
```

**Key convention**: `formatNumber` uses the `en-IN` locale (Indian numbering — Lakhs/Crores). This is intentional and must not be changed to `en-US`.

---

## @wo-library/web — Browser Utilities

**Purpose**: DOM, network, and storage utilities requiring a browser environment.

```
src/tools/
├── css.ts              cssVariable(), overrideStyleProperty()
├── svg.ts              svgNodeToData(), responseTextToData()
├── loadScript.ts       Dynamic <script> injection with CSP nonce
├── loadStylesheet.ts   Dynamic <link> injection with CSP nonce
├── error/              WoError, WoLoadScriptError, WoNetworkError, WoResponseError
├── fetch/
│   ├── index.ts        WoFetchBase, WoFetch — configurable HTTP client
│   ├── constants.ts    HTTP_STATUS, CONTENT_TYPE_*, ACCESS_TOKEN_KEY
│   ├── errorHandlers.ts defaultErrorHandler, getResponseData
│   ├── responseHandlers.ts jsonResponseHandler, textResponseHandler
│   └── utils.ts        createUrl, combineUrls, getFormData, getFetchBody, ...
├── storage/            AnyStorage — localStorage/sessionStorage/memory abstraction
├── others/routing.ts   redirectToLogout()
└── payments/           razorpayCheckout()
```

### WoFetch Usage Pattern

```typescript
import { fetch } from "@wo-library/web";

class ApiService extends fetch.WoFetch {
  constructor() {
    super({ endpoint: process.env.API_URL });
  }
}

const api = new ApiService();
const user = await api.getUrl<User>("/users/1", { requireAuth: true });
await api.postUrl("/users", { data: { name: "Alice" }, requireAuth: true });
```

---

## @wo-library/ui — Styles & Themes

**Purpose**: Shared design system CSS. No JavaScript logic — only CSS Modules and SVG path data.

```
src/
├── styles/
│   ├── base.css        CSS reset and base variables
│   ├── media.css       Breakpoint custom properties
│   └── media.ts        TypeScript breakpoint constants
├── themes/
│   ├── fresh.module.css   "Fresh" theme tokens
│   └── trusty.module.css  "Trusty" theme tokens
├── svg/paths/          SVG path data for icons
└── types/              Type definitions
```

---

## @wo-library/react — React Component Library

**Purpose**: UI components and hooks for building application UIs.

### Component Architecture (Atomic Design)

```
src/components/
├── atoms/          Self-contained, reusable primitives
│   ├── Button/
│   ├── TextInput/
│   ├── NumberInput/    Uses formatNumber() from @wo-library/js
│   ├── Modal.tsx       Uses @floating-ui/react
│   ├── Card/
│   ├── Image/
│   ├── Text/
│   ├── Spinner/
│   ├── Tag/
│   ├── Anchor/
│   ├── Container/
│   └── ...
├── molecules/      Compositions of atoms
│   ├── CardLink/
│   └── Popover/
├── structures/     Layout compositions of molecules
└── templates/      Full-page templates
```

**Polymorphic pattern**: Many components accept an `as` prop to change the rendered HTML element:

```tsx
// Renders as a Next.js Link
<Card as={NextLink} href="/about">...</Card>
<Anchor as={NextLink} href="/home">Home</Anchor>
```

**Busy/Loading pattern**: Components distinguish two loading states:
- `isBusy` — a spinner overlay appears while a background operation runs; content remains visible
- `isLoading` — content is replaced entirely by a skeleton/placeholder loader

### Hooks

```
src/hooks/
├── useCalendly.ts        Load Calendly SDK → open popup
├── useMethods.ts         useReducer with named methods
├── useScrollDirection.ts Track scroll direction (up/down)
├── useStateWithProp.ts   Sync local state with prop changes
├── usePropRef.ts         Merge multiple forwarded refs
└── useMeasureInput.ts    Measure label height for input layout
```

### Contexts

All contexts follow a **split-context pattern** to prevent unnecessary re-renders:

```
src/contexts/
├── utils.tsx             createAndUseContext(), getUpdateStateMethod()
├── ThemeContext/         ThemeProvider, useThemeState, useThemeMethods
├── LayoutContext/        LayoutProvider, useLayoutState, useLayoutMethods
├── ScrollContext/        Scroll position sharing
└── ChartContext/         Shared state for chart components
```

**Split-context pattern**:
```tsx
// Create separate state and dispatch contexts
const { StateContext, MethodContext, useContextState, useContextMethods } =
  createAndUseContext<MyState, ContextDispatch<MyMethods>>();

// Render two nested providers
<MethodContext.Provider value={{ dispatch: methods }}>
  <StateContext.Provider value={state}>
    {children}
  </StateContext.Provider>
</MethodContext.Provider>
```

Components consuming only methods do not re-render when state changes.

---

## Styling Architecture

All components use **CSS Modules** (`*.module.css`). No inline styles.

### Variant Pattern

Dynamic class names are applied using `getDynamicClassName`:

```tsx
import { getDynamicClassName } from "../../../tools/utils.js";

// In component:
className={clsx(
  styles.root,
  variant && getDynamicClassName(styles, `variant-${variant}`),
  size && getDynamicClassName(styles, `size-${size}`),
)}
```

CSS Module class names must be declared in the `/* eslint css-modules/no-unused-class */` pragma at the top of the file.

### Theme System

Themes are injected via `ThemeContext` and applied as CSS class names on the root element. The active theme class provides CSS custom property overrides.

---

## State Management Pattern

Internal component state uses **`useMethods`** (named-method reducer):

```typescript
const [state, { setLoading, updateData }] = useMethods(
  (state) => ({
    setLoading: (loading: boolean) => ({ ...state, loading }),
    updateData: (data: DataType) => ({ ...state, data }),
  }),
  initialState,
);
```

Prefer this over `useReducer` + switch statements for readability.

---

## Build System

- **Rollup** with Babel (preset-env + preset-react + preset-typescript)
- Each package has its own `rollup.config.js`
- Output: ESM only (`dist/index.js` + `dist/index.d.ts`)
- Peer dependencies (React, lodash-es) are externalized

---

## Testing

- **Jest** with `@jest/globals` (no `jest` global — import from `@jest/globals`)
- **React Testing Library** for component tests
- Tests live in `__tests__/` subdirectories alongside source files
- Storybook stories (`.stories.tsx`) serve as living documentation

---

## Exports Convention

- **Named exports only** — never `export default` on public APIs
- Exception: individual component files export as `default` (consumed by barrel files)
- All public APIs re-exported from the package root `src/index.ts`
