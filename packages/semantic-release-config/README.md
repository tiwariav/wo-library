# @wo-library/semantic-release-config

Shared release configuration for [semantic-release](https://semantic-release.gitbook.io/)
and [Nx release](https://nx.dev/features/manage-releases), using
[Conventional Commits](https://www.conventionalcommits.org/).

## Installation

```bash
yarn add --dev @wo-library/semantic-release-config
```

## Usage

### semantic-release (`.releaserc.cjs`)

```javascript
const config = require("@wo-library/semantic-release-config");
module.exports = config;
```

Automatically publishes to npm, generates a `CHANGELOG.md`, creates a GitHub release
(when `GITHUB_TOKEN` is set), and bumps `package.json`.

### Nx release (`nx.json` or `nx.config.js`)

```javascript
const { getNxReleaseConfig } = require("@wo-library/semantic-release-config/nx");

module.exports = {
  ...getNxReleaseConfig({
    projects: ["packages/*"],
    createGitHubRelease: true,
  }),
};
```

## Commit types → semver

| Type       | Title            | Bump          |
| ---------- | ---------------- | ------------- |
| `feat`     | ✨ Features       | `minor`       |
| `fix`      | 🐛 Bug Fixes      | `patch`       |
| `perf`     | ⚡️ Performance    | `patch`       |
| `refactor` | ♻️ Code Refactors | `patch`       |
| `docs`     | 📚 Documentation  | `patch`       |
| `style`    | 🎨 Styles         | none          |
| `test`     | 🚦 Tests          | none          |
| `revert`   | Reverts          | `patch`       |
| `chore`    | Chores           | none (hidden) |

## Known Issues

- Yarn PnP does not work when setting `preset` for `@semantic-release/release-notes-generator`
  to `conventionalcommits` — the plugin uses `import-from-esm` internally which cannot resolve
  packages under PnP. Use the default preset or run with `nodeLinker: node-modules`.
