# Templates

Full-page template layouts composed from structures and atoms. Templates represent
distinct page types and are the top level of the atomic design hierarchy.

Import from `@wo-library/react`:

```tsx
import { Collection, Details, Profile } from "@wo-library/react";
```

---

## Components

### `Collection`

A filterable, sortable list/grid of items. Renders a toolbar with optional filter and sort
controls above a responsive content grid.

```tsx
import { Collection } from "@wo-library/react";

<Collection
  title="Products"
  variant="grid"
  filter={[{ key: "category", name: "Category", options: ["A", "B"] }]}
  sort={[{ key: "name", name: "Name" }]}
>
  {products.map((p) => (
    <ProductCard key={p.id} {...p} />
  ))}
</Collection>;
```

**Props**:

| Prop       | Type               | Description                         |
| ---------- | ------------------ | ----------------------------------- |
| `children` | `ReactNode`        | Grid/list items                     |
| `columns`  | `number`           | Fixed column count (overrides auto) |
| `filter`   | `FilterOption[]`   | Filter options for the toolbar      |
| `sort`     | `SortOption[]`     | Sort options for the toolbar        |
| `title`    | `string`           | Collection heading                  |
| `variant`  | `'list' \| 'grid'` | Layout mode                         |

---

### `Details`

A two-column detail layout with main content and a sidebar, plus header slots for both.

```tsx
import { Details } from "@wo-library/react";

<Details
  headerMain={<h1>Product Name</h1>}
  headerSide={<PricePanel />}
  contentSide={<RelatedItems />}
  hasSeparator
>
  <ProductDescription />
  <ReviewList />
</Details>;
```

**Props** (extends `ContainerProps`):

| Prop           | Type        | Description                             |
| -------------- | ----------- | --------------------------------------- |
| `children`     | `ReactNode` | Main content area items                 |
| `contentSide`  | `ReactNode` | Sidebar content                         |
| `hasSeparator` | `boolean`   | Adds a visual separator between columns |
| `headerMain`   | `ReactNode` | Main column header                      |
| `headerSide`   | `ReactNode` | Sidebar column header                   |

---

### `Profile`

A profile page layout with a cover image, avatar, and a grid of content cards.

```tsx
import { Profile } from "@wo-library/react";

<Profile
  coverImage="https://example.com/cover.jpg"
  image="https://example.com/avatar.jpg"
  name="Jane Doe"
  subtitle="Software Engineer"
>
  <ActivityCard />
  <StatsCard />
</Profile>;
```

**Note**: Image URLs are typically set via `process.env.STORYBOOK_IMAGE_SRC` in stories.
