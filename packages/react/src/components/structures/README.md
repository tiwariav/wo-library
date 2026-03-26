# Structures

Larger-scale layout structures that compose atoms and molecules into complete page regions.
Most structures integrate with `LayoutContext` for coordinated state (e.g., sidebar toggle).

Import from `@wo-library/react`:

```tsx
import {
  TopNav,
  SideNav,
  SideNavToggle,
  Page,
  WoSwiper,
} from "@wo-library/react";
```

---

## Components

### `Page`

Full-page layout shell that orchestrates `TopNav`, `SideNav`, hero, and main content.
Wraps everything in `LayoutProvider`.

Two layout variants:

- `'[T][SC]'` — TopNav spans full width, SideNav beside content (default)
- `'[S][TC]'` — SideNav spans full height, TopNav beside content

```tsx
import { Page, TopNav, SideNav } from "@wo-library/react";

<Page
  topNav={<TopNav logo={<Logo />} />}
  sideNav={
    <SideNav>
      <nav>...</nav>
    </SideNav>
  }
  hero={<Hero title="Dashboard" />}
>
  <MainContent />
</Page>;
```

**Props**: `children`, `hero`, `topNav`, `sideNav`, `isCentered`, `variant`, `innerClassNames`, `className`.

---

### `SideNav`

Collapsible sidebar driven by `LayoutContext`. Renders an overlay backdrop on mobile.

```tsx
import {
  SideNav,
  SideNavGroup,
  SideNavFooter,
  SideNavToggle,
} from "@wo-library/react";

<SideNav>
  <SideNavGroup title="Main">
    <NavLink to="/home">Home</NavLink>
  </SideNavGroup>
  <SideNavFooter>
    <UserProfile />
  </SideNavFooter>
</SideNav>;
```

**Related exports**: `SideNav`, `SideNavFooter`, `SideNavGroup`, `SideNavToggle` (button that toggles `LayoutContext.sideNav.isToggled`).

**Note**: Must be rendered inside a `LayoutProvider` (done automatically by `Page`).

---

### `TopNav`

Sticky / pinned top navigation bar with logo, left content, and right content slots.
Integrates with `LayoutContext` to show a hamburger toggle when a `SideNav` is present.

```tsx
import { TopNav, TopNavItem } from "@wo-library/react";

<TopNav
  logo={<Logo />}
  contentLeft={[<SearchInput />]}
  contentRight={[<UserMenu />, <NotificationBell />]}
/>;
```

**Related exports**: `TopNav`, `TopNavItem` (wrapper for individual nav content items).

**Note**: Must be rendered inside a `LayoutProvider` (done automatically by `Page`).

---

### `WoSwiper`

Carousel/slider built on [Swiper.js](https://swiperjs.com/) with preconfigured modules:
`A11y`, `Autoplay`, `EffectCoverflow`, `FreeMode`, `Mousewheel`, `Navigation`, `Pagination`.

```tsx
import { WoSwiper } from "@wo-library/react";

<WoSwiper title="Featured" navigation pagination>
  <Card>Slide 1</Card>
  <Card>Slide 2</Card>
  <Card>Slide 3</Card>
</WoSwiper>;
```

**Props**: `title`, `subtitle`, `moreLink`, `moreLinkVertical`, `variant` (`'coverflow'`), `fade`,
`freeMode`, `navigation`, `pagination`, plus all Swiper props.
