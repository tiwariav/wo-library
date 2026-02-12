# @tiwariav/semantic-release-config

## Known Issues

- yarn pnp does not work when setting `preset` for `@semantic-release/release-notes-generator` to `conventionalcommits`, this plugin internally uses a package `import-from-esm`, which is not able to find the package when using pnp.
