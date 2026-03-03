# @wo-library/postcss-config

Shareable PostCSS configuration for wo-library packages and consuming projects.

Includes: `postcss-import`, `postcss-global-import`, `postcss-mixins`, `postcss-preset-env`
(stage 1, nesting, custom properties, custom media queries) and `cssnano` (advanced preset,
`zindex` disabled).

> **Note:** This package uses CommonJS (`"type": "commonjs"`) because rollup-postcss loads
> config files via `require()` internally.

## Installation

```bash
pnpm add -D @wo-library/postcss-config
```

## Usage

### `postcss.config.cjs`

```javascript
const { getConfig } = require("@wo-library/postcss-config");

module.exports = getConfig();
```

### With custom global data (design token custom properties)

```javascript
const { getConfig } = require("@wo-library/postcss-config");

module.exports = getConfig("production", {
  globalDataOptions: { files: ["src/styles/tokens.css"] },
});
```

### With string-based config (for tools that serialise the config)

```javascript
const { getStringConfig } = require("@wo-library/postcss-config");

module.exports = getStringConfig("development");
```

## API

| Export                            | Description                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------ |
| `getConfig(env?, options?)`       | Returns a PostCSS config object with plugin instances.                         |
| `getStringConfig(env?, options?)` | Returns a PostCSS config object using string plugin names (for serialisation). |
| `getPresetEnvOptions(options?)`   | Returns just the `postcss-preset-env` options object.                          |

### Options

| Option              | Type     | Description                                                                |
| ------------------- | -------- | -------------------------------------------------------------------------- |
| `globalDataOptions` | `object` | Forwarded to `@csstools/postcss-global-data` (e.g. `{ files: [...] }`).    |
| `mixinOptions`      | `object` | Forwarded to `postcss-mixins`.                                             |
| `presetEnvOptions`  | `object` | Overrides for `postcss-preset-env` (`{ preserveMediaQueries?: boolean }`). |
