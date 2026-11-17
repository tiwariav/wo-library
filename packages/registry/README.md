# @wo-library/registry

Source for the shadcn-style registry (not published to npm). Consumers will copy
items with `npx shadcn add @wo/<item>` once the registry is published in phase 4.

## Layout

| Path | Kind | Notes |
| --- | --- | --- |
| `hooks/` | `registry:hook` | Salvaged from `@wo-library/react` (phase 0); more in phase 3 |
| `lib/` | `registry:lib` | `createAndUseContext` and related helpers |
| `themes/` | `registry:theme` | Tailwind 4 `@theme` tokens (fresh, trusty) |
| `ui/` | `registry:ui` | Added in phase 4 |

## Hooks

- `useMethods` — named-method alternative to `useReducer`
- `useStateWithProp` — local state synced to a prop
- `usePropRef` — merge forwarded refs
- `useScrollDirection` — up/down scroll tracking
- `useLocalStorage` — state synced to `localStorage`
- `useCalendly` — Calendly popup loader
