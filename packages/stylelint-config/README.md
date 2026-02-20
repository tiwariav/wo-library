# @wo-library/stylelint-config

Shareable Stylelint configuration for wo-library projects.

Extends `stylelint-config-standard` and `stylelint-config-clean-order` with additional
rules for accessibility, CSS nesting, defensive CSS, custom media queries, custom
properties, and strict value declarations.

## Included plugins

| Plugin                                              | Purpose                                        |
| --------------------------------------------------- | ---------------------------------------------- |
| `@double-great/stylelint-a11y`                      | Accessibility rules for CSS                    |
| `stylelint-config-clean-order`                      | Consistent property ordering                   |
| `stylelint-media-use-custom-media`                  | Enforce custom media query variables           |
| `stylelint-plugin-defensive-css`                    | Defensive CSS patterns                         |
| `stylelint-use-nesting`                             | Encourage CSS nesting                          |
| `stylelint-value-no-unknown-custom-properties`      | Validate custom property usage                 |
| `stylelint-declaration-block-no-ignored-properties` | Catch ignored declarations                     |
| `stylelint-declaration-strict-value`                | Enforce variable usage for specific properties |

## Installation

```bash
yarn add --dev stylelint @wo-library/stylelint-config
```

## Usage

### `.stylelintrc.json`

```json
{
  "extends": ["@wo-library/stylelint-config"]
}
```

### Individual plugin only

```json
{
  "plugins": ["@wo-library/stylelint-config/plugins/color"]
}
```

## Notable rules

- `alpha-value-notation: "number"` — use `0.5` not `50%` for alpha
- `font-weight-notation: "numeric"` — use `700` not `bold`
- `max-nesting-depth: 4`
- `at-rule-no-unknown: null` / `function-no-unknown: null` — allow PostCSS extensions

## Known Issues

- VS Code Stylelint extension has issues with Yarn PnP:
  <https://github.com/stylelint/vscode-stylelint/issues/464>

  Until fixed, the package remains CommonJS and `@double-great/stylelint-a11y` is excluded
  from the default config (tracked for re-enabling).
