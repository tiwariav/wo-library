# Atoms

The smallest reusable building blocks in the component hierarchy. Each atom is a
self-contained component with no dependencies on other composite components.

Import from `@wo-library/react`:

```tsx
import { Button, TextInput, Card } from "@wo-library/react";
```

---

## Navigation

| Component  | Description                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------- |
| `Anchor`   | Polymorphic link with icon slots, size/variant/spacing props. Supports any element via `as`. |
| `Bookmark` | Breadcrumb-style list — children separated by `IconCircleChevronRight`.                      |

## Form Elements

| Component              | Description                                                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `Button`               | Primary interactive element with icon slots, `isBusy`/`isLoading`, variant, spacing, and size props. Polymorphic via `as`. |
| `FileInput`            | File picker with drag-and-drop list, `isBusy`, typed generic `TFile extends UploadFile`.                                   |
| `FormattedInput`       | Text input with `format` (display) and `parse` (value) transforms. Emits `(event, parsedValue, shouldUpdate)`.             |
| `FormControl`          | Low-level control wrapper (exports `useFormControl` hook).                                                                 |
| `FormError`            | Inline error message element for form validation.                                                                          |
| `FormGroup`            | Wraps a field with a label and validation error. Renders `<label>` when `label` is provided.                               |
| `HookForm`             | Thin wrapper around react-hook-form's `<FormProvider>`.                                                                    |
| `HookFormInputWrapper` | Connects any input to react-hook-form via `useController`. Handles react-select compatibility.                             |
| `InputWrapper`         | Styled wrapper for icon-padded inputs.                                                                                     |
| `Label`                | Styled `<label>` element.                                                                                                  |
| `NumberInput`          | Numeric input with `format`/`parse` via `FormattedInput`, step controls.                                                   |
| `PhoneNumberInput`     | Pre-configured `FormattedInput` for E.164 phone numbers.                                                                   |
| `TextInput`            | Base text input with icon slots (`iconBefore`, `iconAfter`), `isBusy`, `isLoading`, variants.                              |

## Layout

| Component   | Description                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------- |
| `Container` | Flex/block wrapper with configurable `height`, `spacing`, `width` CSS custom property props. |
| `Divider`   | `<hr>` (horizontal) or `<div role="separator">` (vertical) with `spacing` variants.          |
| `Hero`      | Full-width banner section with `title`, `midContent`, and children slots.                    |

## Media

| Component | Description                                                                          |
| --------- | ------------------------------------------------------------------------------------ |
| `Image`   | Responsive image with aspect ratio, object-fit, fallback, and skeleton loading.      |
| `Symbol`  | SVG shape-masked container (circle, flag, pin, triangle) for avatars or map symbols. |

## Typography

| Component  | Description                                                                             |
| ---------- | --------------------------------------------------------------------------------------- |
| `Lorem`    | Placeholder lorem ipsum text generator.                                                 |
| `Tag`      | Inline label/badge with icon slots, `loading` state.                                    |
| `Text`     | Paragraph/span with typography variant props.                                           |
| `TextIcon` | `<span>` that spaces text and an adjacent icon consistently.                            |
| `Title`    | Polymorphic heading/div with `align` and `variant` (`tinyline`, `tinyline-left`) props. |

## Progress Indicators

| Component        | Description                                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| `ArcProgress`    | SVG arc-shaped progress indicator. `progress: [current, total]`, configurable `segments` and `strokeWidth`. |
| `CircleProgress` | SVG circular progress. `progressText` accepts `'parts'`, `'percent'`, `'value'`, or a custom unit string.   |

## Loading States

| Component       | Description                                                        |
| --------------- | ------------------------------------------------------------------ |
| `LoaderWrapper` | Minimal full-size `<div>` placeholder for skeleton loading states. |
| `Spinner`       | Animated spinner overlay. Shows over content (`isBusy` pattern).   |
| `Spinkit`       | Collection of CSS-animated spinner variants.                       |

## Overlays

| Component | Description                                                                      |
| --------- | -------------------------------------------------------------------------------- |
| `Modal`   | Accessible dialog with `isOpen`/`onClose` API, portal rendering, and focus trap. |
| `Tooltip` | Floating tooltip/popover powered by `@floating-ui/react`. `trigger`: `'hover'    | 'click' | 'focus'`, `portal` prop. |

## Viewport Observers

| Component       | Description                                                                                              |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| `ObserveInView` | Wraps children in an `IntersectionObserver` and applies `animate`/`inView`/`outTop`/`outBottom` classes. |

## Utilities

| Component            | Description                                                                |
| -------------------- | -------------------------------------------------------------------------- |
| `AntFormItemWrapper` | Adapts an ant-design `Form.Item` for use with react-hook-form.             |
| `AsElement`          | Utility component that renders just its `as` element with forwarded props. |

---

## Common Patterns

### `isBusy` vs `isLoading`

```tsx
// isBusy — spinner overlays content, content remains in DOM
<Button isBusy>Submit</Button>

// isLoading — skeleton replaces content
<TextInput isLoading />
```

### Polymorphic `as` prop

```tsx
// Render an Anchor as a react-router Link
import { Link } from "react-router-dom";
<Anchor as={Link} to="/home">Go Home</Anchor>
```

### `progress` tuple

ArcProgress and CircleProgress accept `[current, total]`:

```tsx
<CircleProgress progress={[7, 10]} progressText="percent" />
```
