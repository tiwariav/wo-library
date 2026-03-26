# @wo-library/eslint-config

Shareable ESLint configuration for the wo-library monorepo and consuming projects.
Covers TypeScript, React, JSX accessibility, CSS Modules, i18n (FormatJS), testing,
and code-quality rules.

## Installation

```bash
pnpm add -D @wo-library/eslint-config
```

## Usage

### Flat config (ESLint v9+)

```javascript
// eslint.config.js
import config from "@wo-library/eslint-config";
export default config;
```

### CommonJS flat config (VS Code ESLint extension compatibility)

```javascript
// eslint.config.cjs
const config = require("@wo-library/eslint-config/flatConfig.cjs");
module.exports = config;
```

### Next.js projects

```javascript
// eslint.config.js
import config from "@wo-library/eslint-config/nextjs";
export default config;
```

## Included plugins

The config extends recommended configs from:

Supporting flat config

- eslint-config-prettier
- eslint-config-react-app
- eslint-plugin-compat
- eslint-plugin-css-modules
- eslint-plugin-etc
- eslint-plugin-formatjs
- eslint-plugin-jest
- eslint-plugin-perfectionist
- eslint-plugin-react
- eslint-plugin-testing-library
- eslint-plugin-unicorn
- eslint-plugin-unused-imports

Not supporting flat config

- eslint-plugin-eslint-comments
- eslint-plugin-import
- eslint-plugin-jsx-a11y
- eslint-plugin-lodash
- eslint-plugin-react-hooks
- eslint-plugin-sonarjs

## Plugins with known issues

- eslint-plugin-etc
The plugin is quite old and doesn't work with latest eslint

- eslint-plugin-import
The plugin does not work with flat config. Also utility of the plugin to be tested.

## Flat config

The file `flatConfig.cjs` is a commonjs module because of an issue with vscode-eslint
<https://github.com/microsoft/vscode-eslint/issues/1620>

## eslint v9 compatibility

Following packages are not compatible with v9 yet:

- eslint-plugin-etc
- eslint-plugin-jsx-expressions
- eslint-plugin-react
