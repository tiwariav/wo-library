# Phase 0 salvage inventory

Generated for the v3 rework. Every file under `packages/react` and `packages/ui`
and its fate before those packages are deleted.

## Summary

| Fate | Count |
|---|---|
| dropped | 274 |
| moved | 22 |
| rebuilt phase 4 | 22 |

## Legend

- **moved** — copied into a kept package (js, web, or registry) in this phase
- **rebuilt phase 4** — behaviour kept (pure logic extracted to js where possible); markup/CSS Modules discarded and rebuilt as registry `ui/` items later
- **dropped** — covered by Tailwind, base-ui, react-use, or unused

## Pure logic extracted to `@wo-library/js`

| Source | Destination |
|---|---|
| `ui/src/svg/paths/{Pin,Flag}.ts` | `js` `svg` module |
| PhoneNumberInput `getFlagEmoji` (+ phone parse helpers) | `js` phone helpers |
| CircleProgress `getProgressClass`, `getCircleStyles` | `js` progress helpers |
| ArcProgress `getAngles` (+ arc constants) | `js` progress helpers |
| NumberInput while-typing formatting | already largely in `formatNumber` / `stringToNumber`; any remaining pure helper goes to `js` |

## Moved to `@wo-library/web`

| Source | Notes |
|---|---|
| `react/src/tools/uploadFile.ts` | `UploadFile` status model; remove `TextInputProps` dependency |

## Moved to `packages/registry`

| Source | Destination |
|---|---|
| hooks: useMethods, useStateWithProp, usePropRef, useScrollDirection, useLocalStorage, useCalendly (+ tests/stories) | `registry/hooks/` |
| `contexts/utils.tsx` (`createAndUseContext`, helpers) | `registry/lib/` |
| `ui` fresh/trusty colour tokens | `registry/themes/` as Tailwind 4 `@theme` |

## File-by-file

| File | Fate | Notes |
|---|---|---|
| `packages/react/.browserslistrc` | dropped | package scaffolding removed with packages/react |
| `packages/react/.commitlintrc.json` | dropped | package scaffolding removed with packages/react |
| `packages/react/.editorconfig` | dropped | package scaffolding removed with packages/react |
| `packages/react/.gitignore` | dropped | package scaffolding removed with packages/react |
| `packages/react/.husky/commit-msg` | dropped | package scaffolding removed with packages/react |
| `packages/react/.husky/post-merge` | dropped | package scaffolding removed with packages/react |
| `packages/react/.husky/pre-commit` | dropped | package scaffolding removed with packages/react |
| `packages/react/.jscpd.json` | dropped | package scaffolding removed with packages/react |
| `packages/react/.prettierignore` | dropped | package scaffolding removed with packages/react |
| `packages/react/.stylelintignore` | dropped | package scaffolding removed with packages/react |
| `packages/react/CHANGELOG.legacy.md` | dropped | package scaffolding removed with packages/react |
| `packages/react/CHANGELOG.md` | dropped | package scaffolding removed with packages/react |
| `packages/react/LICENSE` | dropped | package scaffolding removed with packages/react |
| `packages/react/README.md` | dropped | package scaffolding removed with packages/react |
| `packages/react/babel.config.mjs` | dropped | package scaffolding removed with packages/react |
| `packages/react/chromatic.config.json` | dropped | package scaffolding removed with packages/react |
| `packages/react/jest.config.js` | dropped | package scaffolding removed with packages/react |
| `packages/react/jest.non-ui.config.mjs` | dropped | package scaffolding removed with packages/react |
| `packages/react/package.json` | dropped | package scaffolding removed with packages/react |
| `packages/react/react_build.txt` | dropped | package scaffolding removed with packages/react |
| `packages/react/rollup.config.js` | dropped | package scaffolding removed with packages/react |
| `packages/react/src/components/AsElement.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/__stories/CardTemplates.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/__stories/InputTemplates.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/__stories/SideNavTemplates.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/antd.ts` | dropped | Tailwind / base-ui / unused; wrappers and vendor shims removed |
| `packages/react/src/components/atoms/Anchor/Anchor.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Anchor/Anchor.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Anchor/anchor.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/AntFormItemWrapper.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/AntFormItemWrapper.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/ArcProgress/ArcProgress.stories.tsx` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/ArcProgress/ArcProgress.tsx` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/ArcProgress/arcProgress.module.css` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/ArcProgress/useProgressAnimations.ts` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/AsElement.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/AsElement.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Bookmark/Bookmark.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Bookmark/Bookmark.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Bookmark/bookmark.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Button/Button.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Button/Button.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Button/button.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Card/Card.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Card/Card.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Card/card.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Checkbox/Checkbox.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Checkbox/Checkbox.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Checkbox/__tests__/Checkbox.test.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Checkbox/checkbox.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Checkbox/index.ts` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/CircleProgress/CircleProgress.stories.tsx` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/CircleProgress/CircleProgress.tsx` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/CircleProgress/circleProgress.module.css` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/CircleProgress/circleProgress.stories.module.css` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/Container/Container.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Container/Container.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Container/container.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Divider/Divider.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Divider/Divider.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Divider/divider.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Divider/index.ts` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/FileInput/FileInput.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/FileInput/FileInput.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/FileInput/fileInput.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/FileInput/index.ts` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/FormControl.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/FormControl.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/FormError.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/FormError.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/FormGroup/FormGroup.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/FormGroup/FormGroup.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/FormGroup/formGroup.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/FormattedInput/FormattedInput.stories.tsx` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/FormattedInput/FormattedInput.tsx` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/FormattedInput/formattedInput.module.css` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/FormattedInput/index.ts` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/Hero/Hero.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Hero/Hero.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Hero/hero.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/HookForm.stories.tsx` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/HookForm.tsx` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/HookFormInputWrapper/HookFormInputWrapper.stories.tsx` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/HookFormInputWrapper/HookFormInputWrapper.tsx` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/HookFormInputWrapper/index.tsx` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/Image/Image.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Image/Image.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Image/ImageLoader.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Image/image.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/InputWrapper.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/InputWrapper.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Label.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Label.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/LoaderWrapper.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/LoaderWrapper.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Lorem.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Lorem.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Modal.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Modal.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/NumberInput/NumberInput.stories.tsx` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/NumberInput/NumberInput.tsx` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/NumberInput/index.ts` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/ObserveInView.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/ObserveInView.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/PhoneNumberInput/PhoneNumberInput.stories.tsx` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/PhoneNumberInput/PhoneNumberInput.tsx` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/PhoneNumberInput/phoneNumberInput.module.css` | rebuilt phase 4 | pure logic → @wo-library/js; UI rebuilt as registry:ui |
| `packages/react/src/components/atoms/ProgressBar/ProgressBar.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/ProgressBar/ProgressBar.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/ProgressBar/index.ts` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/ProgressBar/progressBar.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/README.md` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Radio/Radio.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Radio/Radio.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Radio/index.ts` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/SVGCircle.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Spinkit/Bounce.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Spinkit/Chase.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Spinkit/CircleFadeDot.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Spinkit/DoubleBounce.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Spinkit/bounce.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Spinkit/chase.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Spinkit/circleFadeDot.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Spinkit/doubleBounce.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Spinkit/index.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Spinkit.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Spinner/Spinner.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Spinner/Spinner.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Spinner/spinner.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Switch/Switch.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Switch/Switch.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Switch/index.ts` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Switch/switch.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Symbol/Symbol.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Symbol/index.ts` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Symbol/symbol.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Symbol.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Tag/Tag.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Tag/Tag.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Tag/TagLoader.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Tag/tag.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Tag/tagLoader.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Text/Text.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Text/Text.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Text/TextLoader.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Text/__testData.js` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Text/text.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/TextIcon/TextIcon.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/TextIcon/TextIcon.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/TextIcon/textIcon.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/TextInput/PasswordInput.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/TextInput/PasswordInput.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/TextInput/TextInput.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/TextInput/TextInput.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/TextInput/index.ts` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/TextInput/textInput.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Title/Title.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Title/title.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Title.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Tooltip/Tooltip.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Tooltip/Tooltip.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Tooltip/tooltip.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/Tooltip/utils.ts` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/_shared/SelectionControlBase.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/antFormItemWrapper.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/formControl.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/formError.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/hooks/js-overview.stories.tsx` | dropped | overview story; recreate under storybook/registry later |
| `packages/react/src/components/atoms/hooks/useCalendly.stories.tsx` | moved | registry/hooks/useCalendly.stories.tsx |
| `packages/react/src/components/atoms/hooks/useMeasureInput.stories.tsx` | dropped | hook dropped |
| `packages/react/src/components/atoms/hooks/useMethods.stories.tsx` | moved | registry/hooks/useMethods.stories.tsx |
| `packages/react/src/components/atoms/hooks/usePropRef.stories.tsx` | moved | registry/hooks/usePropRef.stories.tsx |
| `packages/react/src/components/atoms/hooks/useScrollDirection.stories.tsx` | moved | registry/hooks/useScrollDirection.stories.tsx |
| `packages/react/src/components/atoms/hooks/useStateWithProp.stories.tsx` | moved | registry/hooks/useStateWithProp.stories.tsx |
| `packages/react/src/components/atoms/icons/Circle.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/index.ts` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/inputWrapper.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/label.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/loaderWrapper.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/modal.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/atoms/observeInView.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/molecules/CardLink/CardLink.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/molecules/CardLink/CardLink.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/molecules/CardLink/cardLink.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/molecules/Popover.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/molecules/Popover.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/molecules/README.md` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/molecules/Select/Select.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/molecules/Select/Select.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/molecules/Select/index.ts` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/molecules/Select/select.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/molecules/Toast/Toast.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/molecules/Toast/Toast.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/molecules/Toast/index.ts` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/molecules/Toast/toast.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/molecules/index.ts` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/molecules/popover.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/Page/Page.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/Page/Page.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/Page/index.ts` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/Page/page.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/README.md` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/SideNav/SideNav.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/SideNav/SideNav.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/SideNav/SideNavFooter.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/SideNav/SideNavGroup.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/SideNav/SideNavItem.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/SideNav/index.ts` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/SideNav/sideNav.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/SideNav/sideNavFooter.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/SideNav/sideNavGroup.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/SideNav/sideNavItem.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/SideNav/utils.ts` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/TopNav/TopNav.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/TopNav/TopNav.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/TopNav/TopNavItem.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/TopNav/index.ts` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/TopNav/topNav.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/TopNav/topNavItem.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/TopNav/utils.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/TopNav/utils.ts` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/WoSwiper/WoSwiper.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/WoSwiper/WoSwiper.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/WoSwiper/woSwiper.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/structures/index.ts` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/swiper.ts` | dropped | Tailwind / base-ui / unused; wrappers and vendor shims removed |
| `packages/react/src/components/templates/Collection/Collection.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/templates/Collection/collection.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/templates/Collection/index.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/templates/Details/Details.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/templates/Details/details.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/templates/Details/index.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/templates/Profile/Profile.stories.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/templates/Profile/index.tsx` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/templates/Profile/profile.module.css` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/templates/README.md` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/components/templates/index.ts` | dropped | CSS Modules / atomic UI replaced by registry + Tailwind + base-ui in phase 4 |
| `packages/react/src/contexts/ChartContext/ChartContext.stories.tsx` | dropped | Theme/Layout/Scroll/Chart/Toast contexts → Tailwind dark mode / sonner |
| `packages/react/src/contexts/ChartContext/index.tsx` | dropped | Theme/Layout/Scroll/Chart/Toast contexts → Tailwind dark mode / sonner |
| `packages/react/src/contexts/ChartContext/methods.ts` | dropped | Theme/Layout/Scroll/Chart/Toast contexts → Tailwind dark mode / sonner |
| `packages/react/src/contexts/ChartContext/state.ts` | dropped | Theme/Layout/Scroll/Chart/Toast contexts → Tailwind dark mode / sonner |
| `packages/react/src/contexts/ContextUtils.stories.tsx` | dropped | docs story for createAndUseContext; recreate in phase 4 |
| `packages/react/src/contexts/LayoutContext/LayoutContext.stories.tsx` | dropped | Theme/Layout/Scroll/Chart/Toast contexts → Tailwind dark mode / sonner |
| `packages/react/src/contexts/LayoutContext/index.tsx` | dropped | Theme/Layout/Scroll/Chart/Toast contexts → Tailwind dark mode / sonner |
| `packages/react/src/contexts/LayoutContext/methods.ts` | dropped | Theme/Layout/Scroll/Chart/Toast contexts → Tailwind dark mode / sonner |
| `packages/react/src/contexts/LayoutContext/state.ts` | dropped | Theme/Layout/Scroll/Chart/Toast contexts → Tailwind dark mode / sonner |
| `packages/react/src/contexts/ScrollContext/ScrollContext.stories.tsx` | dropped | Theme/Layout/Scroll/Chart/Toast contexts → Tailwind dark mode / sonner |
| `packages/react/src/contexts/ScrollContext/index.tsx` | dropped | Theme/Layout/Scroll/Chart/Toast contexts → Tailwind dark mode / sonner |
| `packages/react/src/contexts/ScrollContext/methods.ts` | dropped | Theme/Layout/Scroll/Chart/Toast contexts → Tailwind dark mode / sonner |
| `packages/react/src/contexts/ScrollContext/scrollContext.module.css` | dropped | Theme/Layout/Scroll/Chart/Toast contexts → Tailwind dark mode / sonner |
| `packages/react/src/contexts/ScrollContext/state.ts` | dropped | Theme/Layout/Scroll/Chart/Toast contexts → Tailwind dark mode / sonner |
| `packages/react/src/contexts/ThemeContext/ThemeContext.stories.tsx` | dropped | Theme/Layout/Scroll/Chart/Toast contexts → Tailwind dark mode / sonner |
| `packages/react/src/contexts/ThemeContext/index.tsx` | dropped | Theme/Layout/Scroll/Chart/Toast contexts → Tailwind dark mode / sonner |
| `packages/react/src/contexts/ThemeContext/methods.ts` | dropped | Theme/Layout/Scroll/Chart/Toast contexts → Tailwind dark mode / sonner |
| `packages/react/src/contexts/ThemeContext/state.ts` | dropped | Theme/Layout/Scroll/Chart/Toast contexts → Tailwind dark mode / sonner |
| `packages/react/src/contexts/ToastContext/index.tsx` | dropped | Theme/Layout/Scroll/Chart/Toast contexts → Tailwind dark mode / sonner |
| `packages/react/src/contexts/ToastContext/methods.ts` | dropped | Theme/Layout/Scroll/Chart/Toast contexts → Tailwind dark mode / sonner |
| `packages/react/src/contexts/ToastContext/state.ts` | dropped | Theme/Layout/Scroll/Chart/Toast contexts → Tailwind dark mode / sonner |
| `packages/react/src/contexts/index.ts` | dropped | barrel for dropped contexts |
| `packages/react/src/contexts/utils.tsx` | moved | registry/lib/createAndUseContext.tsx |
| `packages/react/src/hooks/__tests__/useLocalStorage.test.tsx` | moved | registry/hooks/ |
| `packages/react/src/hooks/index.ts` | moved | registry/hooks/index.ts (kept exports only) |
| `packages/react/src/hooks/useCalendly.ts` | moved | registry/hooks/ |
| `packages/react/src/hooks/useClickAway.ts` | dropped | react-use covers this |
| `packages/react/src/hooks/useLocalStorage.ts` | moved | registry/hooks/ |
| `packages/react/src/hooks/useMeasureInput.ts` | dropped | only served the old floating-label input |
| `packages/react/src/hooks/useMethods.ts` | moved | registry/hooks/ |
| `packages/react/src/hooks/usePropRef.ts` | moved | registry/hooks/ |
| `packages/react/src/hooks/useScrollDirection.ts` | moved | registry/hooks/ |
| `packages/react/src/hooks/useStateWithProp.ts` | moved | registry/hooks/ |
| `packages/react/src/hooks/useWindowSize.ts` | dropped | react-use / CSS cover this |
| `packages/react/src/styles/media.ts` | dropped | Tailwind / base-ui / unused; wrappers and vendor shims removed |
| `packages/react/src/tools/__tests__/tools.test.tsx` | dropped | tests for dropped tools; uploadFile covered when moved |
| `packages/react/src/tools/constants/props.ts` | dropped | Tailwind / base-ui / unused; wrappers and vendor shims removed |
| `packages/react/src/tools/storybook.tsx` | dropped | Tailwind / base-ui / unused; wrappers and vendor shims removed |
| `packages/react/src/tools/uploadFile.ts` | moved | @wo-library/web (UploadFile status model; TextInputProps dep removed) |
| `packages/react/src/tools/utils.ts` | dropped | Tailwind / base-ui / unused; wrappers and vendor shims removed |
| `packages/react/src/types/country-flag-emoji-polyfil.d.ts` | dropped | package-local types removed with packages/react |
| `packages/react/src/types/css.d.ts` | dropped | package-local types removed with packages/react |
| `packages/react/src/types/global.d.ts` | dropped | package-local types removed with packages/react |
| `packages/react/src/types/wo-library.d.ts` | dropped | package-local types removed with packages/react |
| `packages/react/src/vendors/ContentLoader.ts` | dropped | Tailwind / base-ui / unused; wrappers and vendor shims removed |
| `packages/react/src/vendors/Lorem.ts` | dropped | Tailwind / base-ui / unused; wrappers and vendor shims removed |
| `packages/react/src/wrappers/div.module.css` | dropped | Tailwind / base-ui / unused; wrappers and vendor shims removed |
| `packages/react/src/wrappers/div.tsx` | dropped | Tailwind / base-ui / unused; wrappers and vendor shims removed |
| `packages/react/src/wrappers/generateCssWrapper.tsx` | dropped | Tailwind / base-ui / unused; wrappers and vendor shims removed |
| `packages/react/src/wrappers/span.module.css` | dropped | Tailwind / base-ui / unused; wrappers and vendor shims removed |
| `packages/react/src/wrappers/span.tsx` | dropped | Tailwind / base-ui / unused; wrappers and vendor shims removed |
| `packages/react/tsconfig.build.json` | dropped | package scaffolding removed with packages/react |
| `packages/react/tsconfig.jest.json` | dropped | package scaffolding removed with packages/react |
| `packages/react/tsconfig.json` | dropped | package scaffolding removed with packages/react |
| `packages/ui/.browserslistrc` | dropped | package scaffolding removed with packages/ui |
| `packages/ui/CHANGELOG.legacy.md` | dropped | package scaffolding removed with packages/ui |
| `packages/ui/CHANGELOG.md` | dropped | package scaffolding removed with packages/ui |
| `packages/ui/LICENSE` | dropped | package scaffolding removed with packages/ui |
| `packages/ui/README.md` | dropped | package scaffolding removed with packages/ui |
| `packages/ui/babel.config.mjs` | dropped | package scaffolding removed with packages/ui |
| `packages/ui/jest.config.mjs` | dropped | package scaffolding removed with packages/ui |
| `packages/ui/package.json` | dropped | package scaffolding removed with packages/ui |
| `packages/ui/rollup.config.js` | dropped | package scaffolding removed with packages/ui |
| `packages/ui/src/__tests__/core.test.ts` | dropped | Tailwind preflight/breakpoints cover styles; overview story dropped |
| `packages/ui/src/index.ts` | dropped | Tailwind preflight/breakpoints cover styles; overview story dropped |
| `packages/ui/src/styles/base.css` | dropped | Tailwind preflight/breakpoints cover styles; overview story dropped |
| `packages/ui/src/styles/media.css` | dropped | Tailwind preflight/breakpoints cover styles; overview story dropped |
| `packages/ui/src/styles/media.ts` | dropped | Tailwind preflight/breakpoints cover styles; overview story dropped |
| `packages/ui/src/svg/index.ts` | moved | @wo-library/js svg module (next to describeArc) |
| `packages/ui/src/svg/paths/Flag.ts` | moved | @wo-library/js svg module (next to describeArc) |
| `packages/ui/src/svg/paths/Pin.ts` | moved | @wo-library/js svg module (next to describeArc) |
| `packages/ui/src/svg/paths/index.ts` | moved | @wo-library/js svg module (next to describeArc) |
| `packages/ui/src/themes/fresh.module.css` | moved | registry/themes/ as Tailwind 4 @theme (registry:theme) |
| `packages/ui/src/themes/index.ts` | moved | registry/themes/index (or dropped barrel) |
| `packages/ui/src/themes/trusty.module.css` | moved | registry/themes/ as Tailwind 4 @theme (registry:theme) |
| `packages/ui/src/types/css.d.ts` | dropped | Tailwind preflight/breakpoints cover styles; overview story dropped |
| `packages/ui/src/ui-overview.stories.tsx` | dropped | Tailwind preflight/breakpoints cover styles; overview story dropped |
| `packages/ui/tsconfig.build.json` | dropped | package scaffolding removed with packages/ui |
| `packages/ui/tsconfig.json` | dropped | package scaffolding removed with packages/ui |
| `packages/ui/typedoc.json` | dropped | package scaffolding removed with packages/ui |
| `packages/ui/ui_build.txt` | dropped | package scaffolding removed with packages/ui |
