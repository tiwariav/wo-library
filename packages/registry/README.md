# @wo-library/registry

Source for the shadcn-style registry (not published to npm). Consumers copy
items with:

```bash
npx shadcn add @wo/hold-button
```

once GitHub Pages serves `r/{name}.json` from
`https://tiwariav.github.io/wo-library/r/{name}.json`.

Add the registry in the consumer `components.json`:

```json
{
  "registries": {
    "@wo": "https://tiwariav.github.io/wo-library/r/{name}.json"
  }
}
```

## Layout

| Path | Kind | Notes |
| --- | --- | --- |
| `hooks/` | `registry:hook` | React hooks |
| `lib/` | `registry:lib` | `cn`, context helpers |
| `themes/` | `registry:theme` | Tailwind 4 `@theme` tokens |
| `ui/` | `registry:ui` | Copy-paste components |
| `registry.json` | — | shadcn registry index |

## Build

```bash
pnpm --filter @wo-library/registry build:registry
```

Writes flattened item JSON to `/r` at the repo root (gitignored; CI publishes it).

## UI

- `HoldButton` — press-and-hold confirm
- `EmptyState` / `ErrorNote` — empty and error callouts
- `Confirm` / `Sheet` — lightweight overlays
- `ArcProgress` — semicircle progress (`@wo-library/js`)
- `NumberInput` / `PhoneInput` — en-IN / digit helpers
- `ImageUpload` — optional client-side shrink (`@wo-library/web`)
- `DataTable` — typed table
- `HookFormField` — presentational form field wrapper

## Hooks

- Phase 0: `useMethods`, `useStateWithProp`, `usePropRef`, `useScrollDirection`, `useLocalStorage`, `useCalendly`
- Phase 3: `useDebouncedValue`, `useLatest`, `useLongPress`, `useIsPhone`, `usePwaInstall`, `useResendCountdown`, `useWebOtp`
