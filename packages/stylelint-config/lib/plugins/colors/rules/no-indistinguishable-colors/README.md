# @tiwariav/stylelint-config/no-indistinguishable-colors

Based on <https://github.com/ierhyna/stylelint-no-indistinguishable-colors>, but uses colorjs.io instead of colorguard to support all the modern colorspaces.

## Options

Boolean, or an array of options, where the first element is `true`, and the second is an options object.

### Optional secondary options

#### threshold: Number

Number can be between `0` and `100`. The default value is `3`.

The lower the threshold the more similar the colors have to be to trigger a violation. The higher the threshold, the more violations you will get.

#### whitelist: Array [['#colorA', '#colorB'], ['#colorC', '#colorD']]

An array of color pairs to ignore.
