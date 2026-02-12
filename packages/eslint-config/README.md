# @tiwariav/eslint-config

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
- eslint-plugin-storybook

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
