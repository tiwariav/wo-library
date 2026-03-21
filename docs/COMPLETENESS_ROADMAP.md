# wo-library Completeness Roadmap

This document outlines the planned additions and improvements to transform **wo-library** into a complete, industry-standard web and application development library.

---

## 1. UI Component Gaps (React)

The following components are essential for a full-featured UI library and are currently missing or need significant expansion.

### Atoms (Foundational Elements)
- [ ] **Checkbox**: Standard checkbox input with support for indeterminate states.
- [ ] **Radio / RadioGroup**: Mutual-exclusion selection controls.
- [ ] **Switch**: An accessible "toggle" switch component.
- [ ] **Slider**: Range selection control.
- [ ] **LinearProgress**: Horizontal progress indicator (complementing `ArcProgress` and `CircleProgress`).
- [ ] **Badge**: Numerical or status indicator (e.g., for notification counts).
- [ ] **Skeleton**: Dedicated skeleton primitives for advanced loading state design.

### Molecules (Composite Components)
- [ ] **Select**: A robust, accessible dropdown selection component supporting search, single-select, and multi-select.
- [ ] **Tabs**: For switching between related content views.
- [ ] **Accordion**: Vertically collapsing content panels.
- [ ] **Breadcrumbs**: Enhanced navigation trails (building on `Bookmark`).
- [ ] **Toast / Notification**: A global notification system for transient feedback.

### Structures (Layout & Data)
- [ ] **DataTable**: A powerful grid component for displaying and manipulating tabular data (sorting, filtering, pagination).
- [ ] **Pagination**: Dedicated controls for navigating multi-page data sets.
- [ ] **Stepper**: A progress indicator for multi-step workflows.

---

## 2. React Hooks Expansion

Common utility hooks to improve developer productivity.

- [ ] **useClickAway**: Detect clicks outside a target element.
- [ ] **useLocalStorage / useSessionStorage**: Type-safe hooks for browser storage with state synchronization.
- [ ] **useWindowSize**: Track viewport dimensions.
- [ ] **useIntersectionObserver**: A hook-based wrapper for the Intersection Observer API.
- [ ] **useInterval / useTimeout**: Declarative versions of standard timers.
- [ ] **useDebounce / useThrottle**: Hook-based rate limiting.

---

## 3. Utility Library Improvements

### `@wo-library/js`
- [ ] **Date Utilities**: Lightweight wrappers for common date formatting and manipulation (without heavy dependencies like Moment.js).
- [ ] **Deep Clone / Merge**: Robust utilities for complex object manipulation.
- [ ] **Validation Helpers**: Common regex patterns and validation logic (Email, URL, etc.).

### `@wo-library/web`
- [ ] **Service Worker Helpers**: Utilities for managing SW lifecycle and caching.
- [ ] **Advanced Fetch Features**: Request interceptors, retry logic, and built-in caching.
- [ ] **Performance Monitoring**: Helpers for tracking Core Web Vitals.

---

## 4. Documentation & Developer Experience (DX)

- [ ] **Component Recipes**: Step-by-step guides for building complex features (e.g., "Custom Auth Forms", "Complex Data Tables").
- [ ] **Interactive Playground**: Enable live code editing in Storybook for all components.
- [ ] **Bundle Size Monitoring**: Automated CI checks to ensure the library remains lightweight.
- [ ] **Accessibility (a11y) Certification**: Automated and manual audits for WCAG compliance across all components.
