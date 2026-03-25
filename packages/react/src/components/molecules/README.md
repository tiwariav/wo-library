# Molecules

Composite components that combine two or more atoms into a cohesive UI pattern.

Import from `@wo-library/react`:

```tsx
import { CardLink, Popover, Select, ToastContainer } from "@wo-library/react";
```

---

## Components

### `CardLink`

A `Card` that makes its entire surface area clickable via a ref to an inner `<a>` element.
Prevents nested click bubbling for interactive children (buttons, links).

```tsx
import { CardLink } from "@wo-library/react";
import { useRef } from "react";

const linkRef = useRef<HTMLAnchorElement>(null);

<CardLink linkRef={linkRef}>
  <a href="/product/1" ref={linkRef}>
    Product Name
  </a>
  <p>Description</p>
</CardLink>;
```

**Props**: All `CardProps` plus `linkRef: MutableRefObject<HTMLAnchorElement | null>`.

---

### `Popover`

A `Tooltip` preconfigured as a popover (styled floating panel with arrow).
Simplifies the `isPopover` + content API from `Tooltip`.

```tsx
import { Popover } from "@wo-library/react";

<Popover content={<div>Rich popup content</div>} trigger="click">
  <button>Open</button>
</Popover>;
```

**Props**: All `TooltipProps` (except `title` is optional) plus `content: ReactNode`.

---

### `Select`

A robust, accessible dropdown selection component supporting search, single-select, and multi-select.

```tsx
import { Select } from "@wo-library/react";

const options = [
  { label: 'Option 1', value: 1 },
  { label: 'Option 2', value: 2 },
];

<Select options={options} onChange={setValue} label="Select an option" />
```

**Props**: `options`, `value`, `onChange`, `multiple`, `label`, `placeholder`, `size`, `hasError`, `disabled`.

---

### `Toast`

A global notification system for transient feedback. Consists of `ToastProvider`, `ToastContainer`, and hooks.

```tsx
import { ToastProvider, ToastContainer, useToastMethods } from "@wo-library/react";

function App() {
  return (
    <ToastProvider>
      <MyComponent />
      <ToastContainer />
    </ToastProvider>
  );
}

function MyComponent() {
  const { dispatch } = useToastMethods();
  return (
    <button onClick={() => dispatch.addToast({ message: 'Success!', type: 'success' })}>
      Show Toast
    </button>
  );
}
```
