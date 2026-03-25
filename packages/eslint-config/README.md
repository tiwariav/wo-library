# @wo-library/eslint-config

Shareable ESLint configuration for the wo-library monorepo and consuming projects.
Covers TypeScript, React, JSX accessibility, CSS Modules, i18n (FormatJS), testing,
and code-quality rules.

## Installation

```bash
pnpm add -D @wo-library/eslint-config
```

## Usage

### ESLint config (ESLint v10)

```javascript
// eslint.config.js
import config from "@wo-library/eslint-config";
export default config;
```

### ESM config (`.mjs`)

```javascript
// eslint.config.mjs
import { defineConfig } from "eslint/config";
import config from "@wo-library/eslint-config";

export default defineConfig(config);
```

### Next.js projects

```javascript
// eslint.config.js
import config from "@wo-library/eslint-config/nextjs";
export default config;
```

## Included plugins

The config extends recommended configs from:

Supporting modern ESLint config

- eslint-config-prettier
- eslint-config-react-app
- eslint-plugin-compat
- eslint-plugin-formatjs
- eslint-plugin-jest
- eslint-plugin-perfectionist
- @eslint-react/eslint-plugin
- eslint-plugin-testing-library
- eslint-plugin-unicorn

No direct preset support used

- eslint-plugin-import
- eslint-plugin-jsx-a11y
- eslint-plugin-lodash
- (covered by @eslint-react/eslint-plugin)
- eslint-plugin-sonarjs

## Plugins with known issues

- eslint-plugin-css-modules
Removed from the active config after crashing under ESLint v10.

- eslint-plugin-import
The plugin does not work with modern config syntax in this setup. Its utility is also under review.

## Config format

This package ships ESLint v10 config using modern config syntax in `eslint.config.js`.

## eslint v9 compatibility

Following packages are not compatible with v9 yet:

- superseded by @eslint-react/eslint-plugin for ESLint v10
