# @wo-library/ui

CSS styles, design-system themes, and SVG path data shared across `@wo-library/react` components.

## Installation

```bash
npm install @wo-library/ui
# or
pnpm add @wo-library/ui
```

## Contents

### Styles

| File               | Description                                       |
| ------------------ | ------------------------------------------------- |
| `styles/base.css`  | CSS reset and base styles                         |
| `styles/media.css` | Responsive breakpoint definitions                 |
| `styles/media.ts`  | TypeScript constants matching the CSS breakpoints |

### Themes

CSS Module themes providing design-system tokens:

| Theme  | File                       |
| ------ | -------------------------- |
| Fresh  | `themes/fresh.module.css`  |
| Trusty | `themes/trusty.module.css` |

Themes are consumed via the `ThemeContext` in `@wo-library/react`.

### SVG Paths

Reusable SVG path data exported from `svg/paths/` for icon and illustration components.

## Usage

```typescript
// Import CSS in your app entry point
import "@wo-library/ui/styles/base.css";

// Import a theme
import freshTheme from "@wo-library/ui/themes/fresh.module.css";
```

## Related Packages

- [`@wo-library/react`](../react) — React components that consume these styles and themes
- [`@wo-library/web`](../web) — CSS variable utilities

## License

MIT
