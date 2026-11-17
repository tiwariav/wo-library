# wo-library v3: utility packages + shadcn registry

**Status: APPROVED by the owner on 2026-11-16. Phases 0–1 done — see progress log. Phase 2 next.**
This is the single source of truth for the v3 rework. Any agent may pick it up: read it in full, then read the
progress log at the bottom and continue from the first phase that is not marked done.

## Goal

Turn wo-library into two things in one Nx monorepo:

1. **npm utility packages**:
   - `@wo-library/js`: environment-agnostic, goes to 3.0.0;
   - `@wo-library/web`: browser-only, goes to 3.0.0;
   - `@wo-library/node`: Node-only, new at 1.0.0.
2. **A shadcn registry** of styled React components, hooks and helpers, built on base-ui + Tailwind 4. Projects copy
   items in with `npx shadcn add @wo/<item>` and own the copy. Behaviour comes from npm (base-ui); appearance is copied
   and edited per project.

The shared config packages stay, and a new `@wo-library/oxlint-config` is added. `@wo-library/react` and
`@wo-library/ui` are removed after their reusable parts have been moved (phase 0).

## Ground rules for agents

- **Never push** without the owner asking in that session. CI runs on push to `main`, and the Release workflow runs
  after CI succeeds and publishes to npm. Local commits are fine and expected, one per logical step, using
  Conventional Commits (commitlint enforces them).
- **Public repo, no business details** (see "Porting rules" below). This applies to code, comments, tests, fixtures,
  commit messages and this plan.
- Heavy commands (`pnpm install`, `nx run-many`, builds, Storybook, full test runs) are fine for this repo, but run one
  at a time. If the machine has a heavy-command wrapper (the owner's laptops use `heavy.sh`), use it.
- Keep `README.md`, `ARCHITECTURE.md`, `.ai/instructions.md` and the generated IDE rule files true to the code at the
  end of each phase.
- Record progress in the log at the bottom: date, phase, what was done, commit hashes, and anything left over.

## State found on 2026-11-16

- **npm only has 1.0.0 of every package** (published 2026-03-03). The repo is at js 2.1.1, web 2.1.2, react 6.2.3,
  eslint-config 3.2.0, postcss-config 2.1.0, stylelint-config 3.1.0 and semantic-release-config 2.1.0. GitHub releases
  and tags exist for those versions, but every Release workflow run since at least 2026-03-27 failed, and the logs have
  expired. The likely cause is npm trusted publishing not being set up for each package.
- No external project depends on any wo-library package yet.
- 51 dependencies have a new major available.
- The build is Rollup + Babel 7, the tests are Jest, and Storybook 10 runs on webpack 5 with PostCSS loaders.
- `docs/AI_AGENT_PLAN.md` and `docs/COMPLETENESS_ROADMAP.md` describe the old component-library direction. This plan
  replaces both.

## Target layout

```
wo-library/
├── packages/
│   ├── js/                      @wo-library/js 3.0.0        pure TS utilities
│   ├── web/                     @wo-library/web 3.0.0       browser utilities
│   ├── node/                    @wo-library/node 1.0.0      Node-only utilities (new)
│   ├── registry/                shadcn registry source: ui/, hooks/, lib/, themes/, registry.json (not on npm)
│   ├── storybook/               Storybook host (React + Vite + Tailwind 4) for package docs and registry items
│   ├── eslint-config/           4.0.0
│   ├── oxlint-config/           1.0.0 (new)
│   ├── postcss-config/          3.0.0
│   ├── stylelint-config/        4.0.0
│   └── semantic-release-config/ 3.0.0
├── .oxlintrc.json               repo lint config, built from oxlint-config
└── nx.json
```

## Phases

### Phase 0: salvage, then remove react and ui

1. Tag the current `main` as `legacy-v2` so the old code stays reachable.
2. **Move every reusable part into a kept package first**, with its tests and stories. Drop only what Tailwind,
   base-ui or react-use already cover:

   | From | Moves to | Notes |
   |---|---|---|
   | `react/src/hooks/{useMethods,useStateWithProp,usePropRef,useScrollDirection,useLocalStorage,useCalendly}.ts` | registry `hooks/` | Merge with the hooks ported in phase 3 so there is one version of each |
   | `react/src/hooks/{useClickAway,useWindowSize}.ts` | dropped | react-use and CSS cover these |
   | `react/src/hooks/useMeasureInput.ts` | dropped | Only served the old floating-label input |
   | `react/src/contexts/utils.tsx` (`createAndUseContext`, split state/method contexts) | registry `lib/` | Theme/Layout/Scroll/Chart/Toast contexts are dropped (Tailwind dark mode, sonner) |
   | `react/src/tools/uploadFile.ts` (`UploadFile` status model) | `@wo-library/web` | Remove the `TextInputProps` dependency |
   | Logic in `PhoneNumberInput` (libphonenumber + flag emoji), `NumberInput` / `FormattedInput` (en-IN formatting while typing), `ArcProgress` / `CircleProgress`, `HookForm` / `HookFormInputWrapper` | pure parts to `@wo-library/js`; components rebuilt as registry `ui/` items in phase 4 | Keep behaviour, not markup or CSS Modules |
   | `ui/src/svg/paths/{Pin,Flag}.ts` | `@wo-library/js` `svg` module | Next to `describeArc` |
   | `ui/src/themes/{fresh,trusty}.module.css` colour tokens | registry `themes/` as Tailwind 4 `@theme` variables (`registry:theme` items) | |
   | `ui/src/styles/*`, `react/src/wrappers/*`, `react/src/vendors/*`, `react/src/tools/{utils,storybook}.ts(x)`, `antd.ts`, `swiper.ts`, the other atoms/molecules/structures/templates | dropped | Covered by Tailwind preflight and breakpoints, base-ui, or unused |

   Before deleting, write `docs/plans/v3-phase0-salvage.md`: every file under `packages/react` and `packages/ui` with
   its fate (moved to X, rebuilt in phase 4, dropped because Y).
3. Delete `packages/react` and `packages/ui`, their stories, their Chromatic config, their entries in
   `nx.json` `release.projects`, `patches/rollup-plugin-postcss*`, and the `*_build.txt` / `build_output.txt` files.
4. Replace `docs/AI_AGENT_PLAN.md` and `docs/COMPLETENESS_ROADMAP.md` with a pointer to this plan (or delete them).
   Update README, ARCHITECTURE.md, `ai-context.json`, `.ai/instructions.md`, `.cursorrules` and
   `.github/copilot-instructions.md`: remove the CSS Modules and atomic-design rules, and describe the new layout.

### Phase 1: toolchain to latest, TS 7

- Upgrade every dependency to its latest version (`pnpm up -r --latest`, then fix breakages). The majors:
  - Nx 22 → 24 (`nx migrate latest`, then `nx migrate --run-migrations`);
  - `@types/node` 26, commitlint 21, lint-staged 17, jscpd 5, glob 14, Chromatic 18;
  - eslint-config: `@eslint-react` 5, `eslint-plugin-unicorn` 80, `eslint-plugin-formatjs` 8, `eslint-plugin-compat` 7;
  - stylelint 18, `stylelint-config-standard` 41, `stylelint-config-clean-order` 10, `stylelint-order` 8;
  - postcss-config: `cssnano` 9, `cssnano-preset-advanced` 10, `postcss-import` 17, `postcss-modules` 9;
  - semantic-release-config: `@semantic-release/changelog` 7, `@semantic-release/git` 11,
    `conventional-changelog-conventionalcommits` 10.
- **TypeScript 7** (`typescript@7`) for typecheck and `.d.ts` emit in js, web, node and registry. Keep a TS 6
  dependency only for tools that need the TypeScript JS API: Storybook docgen, Nx plugins, and typescript-eslint
  inside eslint-config. Call the TS 7 compiler by explicit path in scripts so a `tsc` shim can't resolve to TS 6.
- Build js, web and node with **tsdown** (ESM + `.d.ts` from TS 7). Delete the Rollup and Babel configs and their
  dependencies.
- **Vitest** replaces Jest. Port the existing `__tests__` and remove the Jest configs and dependencies.
- Storybook: move from `@storybook/react-webpack5` to `@storybook/react-vite` with `@tailwindcss/vite`. Drop the
  webpack and PostCSS loaders. Keep Chromatic if its token is still set in CI.
- eslint-config: remove `eslint-config-react-app` (unmaintained, built for eslint 8 and CRA). `@eslint-react` and
  `jsx-a11y` cover it.
- Update `.github/workflows/ci.yml` to the new targets.

### Phase 2: oxlint and `@wo-library/oxlint-config`

- Create `packages/oxlint-config` with these presets:
  - `base.json`: the same rules and options as eslint-config's base (typescript, unicorn, import, promise,
    `no-magic-numbers` ignoring -1/0/1/2, `prefer-destructuring` object-only, the same ignores);
  - `react.json`: react, react-hooks, jsx-a11y and react-perf;
  - `test.json`: vitest and jest rules, applied by `overrides` to test files;
  - `type-aware.json`: tsgolint rules (`oxlint --type-aware`, which runs on the TS 7 compiler).
- Start from `npx @oxlint/migrate` on the eslint flat config, then fix by hand. sonarjs and perfectionist go through
  oxlint `jsPlugins` where that works. The README has a table of eslint-config rules oxlint can't run.
- The repo's own `.oxlintrc.json` extends these presets.
- Run oxlint over js, web, node, registry and storybook. Fix the findings, and compare with an eslint run on the same
  files. Write `docs/plans/v3-phase2-oxlint.md` with:
  - rules that disagree between the two linters;
  - real bugs found;
  - the speed difference;
  - a recommendation for what the `lint` target and lint-staged should run.

### Phase 3: port generic utilities from the owner's application code

The owner has private application repos with generic utilities worth sharing. The file-by-file inventory is **not in
this repo**. It lives in `local/source-inventory.md`, which is gitignored and present only on the owner's machines.
If that file is missing, ask the owner for it; don't guess.

What gets ported:
- `@wo-library/js`: formatting (dates, currency, Indian grouping, relative time, number to words), date presets and
  time windows, string helpers, text matching, polyline encode/decode, geo distance maths, safe error shaping,
  duplicate-name suffixing.
- `@wo-library/web`: client-side image shrinking (two-pass, WebP with JPEG fallback), EXIF and capture metadata,
  geolocation, clipboard, phone helpers, `lazyWithRetry` and chunk-reload recovery, view transitions, form drafts,
  camera availability, web push, CSV export, the `UploadFile` model from phase 0.
- `@wo-library/node`: rate limiting, idempotency keys, outbound vendor rate limiting, upload key building, media-type
  handling, request helpers. Each is separated from any web framework and ORM, with those passed in as adapters.
- registry `hooks/`: long press, debounced value, phone breakpoint, PWA install prompt and store, resend countdown,
  WebOTP, `useLatest`, plus the phase 0 hooks.

Each package README gets a function index with short examples. Every export has a test or a Storybook docs page.

### Phase 4: the registry and first components

- `packages/registry`: `registry.json` with items typed `registry:ui`, `registry:hook`, `registry:lib` and
  `registry:theme`. Items declare npm `dependencies` on `@wo-library/js` / `web` when they use them, and
  `registryDependencies` on other items. `shadcn build` writes `r/*.json`.
- A GitHub Pages workflow serves the build. Consumers add the registry once in `components.json`:
  `"registries": { "@wo": "https://tiwariav.github.io/wo-library/r/{name}.json" }`.
- First items: HoldButton, Sheet, Confirm, EmptyState and ErrorNote, DataTable, ImageUpload (uses the web image
  shrinker), PhoneInput, NumberInput (en-IN), ArcProgress, the react-hook-form field wrapper, the fresh and trusty
  themes, and every hook from phases 0 and 3. Each gets a Storybook story.
- Verify the registry resolves: `shadcn add @wo/hold-button` into a scratch Vite app outside the repo.

### Phase 5: release and adoption

- Fix the Release workflow. Set up npm trusted publishing for each package (npmjs.com → package → settings), or use an
  `NPM_TOKEN` secret. Run `nx release --dry-run` and check the versions it plans.
- Versions to publish: js 3.0.0, web 3.0.0, node 1.0.0, oxlint-config 1.0.0, eslint-config 4.0.0, stylelint-config
  4.0.0, postcss-config 3.0.0, semantic-release-config 3.0.0. All config packages need a new major: npm never had
  anything after 1.0.0, and the dependency upgrades change rules and output for consumers.
- The owner pushes, or asks an agent to push. That triggers the release.
- `npm deprecate` `@wo-library/react` and `@wo-library/ui`, with a message pointing to the registry.
- Adopt in the owner's side projects: install the packages, add the `@wo` registry, and replace their local copies of
  the image shrinker, relative time and UI primitives. Those projects' agents do this in their own repos.

### Phase 6 (later, separate plan): the owner's application consumes the packages

This is tracked outside this repo.

## Porting rules (public repo)

Every file ported from private code follows these rules:

- **Remove:** product, company and domain names; customer, vendor and person names; phone numbers, emails and IDs;
  URLs and hostnames; API keys and environment variable names; AI prompts; internal ticket or session references; and
  comments that describe the business.
- **Generalise:** rename domain identifiers to neutral ones, turn hard-coded business constants into parameters with
  sensible defaults, and rewrite comments so the "why" stays and the business context goes.
- **Tests and fixtures** use made-up data only.
- **Before each commit**, run the scrub check from `local/scrub-check.sh` (gitignored, owner machines only) on the
  staged diff. Any hit blocks the commit. Without it, at least grep the diff for names of the source project and any
  `@<scope>/` imports that are not `@wo-library/`.
- **Commit messages** do not name the source project.

## Verification per phase

- Typecheck (TS 7), oxlint, Vitest for changed packages, `nx run-many -t build`, and a Storybook build.
- Phase 4: the registry install check above.
- Phase 5: `nx release --dry-run` output, then the published versions on npm.

## Progress log

| Date | Phase | Done | Commits | Left over |
|---|---|---|---|---|
| 2026-11-16 | — | Plan approved and committed | (this commit) | Phase 0 next |
| 2026-11-17 | 0 | Tagged `legacy-v2`; wrote salvage inventory; salvaged hooks/lib/themes into `packages/registry`, `UploadFile` into web, SVG/progress/phone/number helpers into js; deleted `packages/react` + `packages/ui` (+ patch/`*_build.txt`); updated README/ARCHITECTURE/AI docs/storybook | `cf6ef65`, `0ec25f9`; tag `legacy-v2` → `4b5b6d7` | Phase 0 complete. Next: phase 1 toolchain. Smoke-check Storybook for registry+web. Phone parse/format stays for phase 4 PhoneInput (Jest cannot load libphonenumber metadata). |
| 2026-11-17 | 1 | Nx 22→24; deps latest; TypeScript 7 + tsdown + Vitest for js/web; Storybook → `@storybook/react-vite` + Tailwind 4 (`@tailwindcss/vite`); dropped CRA eslint; CI adds typecheck/build and registry paths; fixed jsdom `CSS.escape` / TS7 fetch overloads; `@types/node` for js timers | `61a2c7a`, `722fd0d`, `82f9708`, `4a92567` | Phase 1 complete. Next: phase 2 oxlint-config. Optional: delete leftover `packages/storybook/src/storybook.css` when registry stories no longer need it. |
