# stylelint-config

Shareable config for stylelint.

## Known Issues

- Vscode plugin issue with yarn pnp
  <https://github.com/stylelint/vscode-stylelint/issues/464>

When the above is fixed:

- package can be converted to esm
- Following packages can be used again
  - <https://github.com/double-great/stylelint-a11y>

## Installation

```bash
npm install --save-dev stylelint @tiwariav/stylelint-config
```

## Usage

Use with the shared config:

```javascript
{
  "extends": [
    "@tiwariav/stylelint-config"
  ]
}
```

To only use a particular plugin:

```javascript
{
  "plugins": [
    "@tiwariav/stylelint-config/plugins/color"
  ],
}
```
