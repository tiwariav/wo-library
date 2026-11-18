# Oxlint coverage gaps vs `@wo-library/eslint-config`

Generated from `pnpm exec migrate eslint.config.mjs --type-aware --details`
(oxlint / `@oxlint/migrate` 1.94.0). Refresh when bumping oxlint or eslint-config plugins.

Oxlint is the fast default lint. ESLint stays as a slower gate until these gaps shrink.

## Summary

| Status | Count | Meaning |
| --- | ---: | --- |
| Migrated into presets | 723 | Present in the generated `.oxlintrc` snapshot |
| Not implemented | 175 | ESLint rule has no oxlint equivalent yet — keep eslint for these |
| Unsupported | 28 | Intentionally not ported (superseded, stylistic, or covered elsewhere) |
| Nursery (skipped) | 6 | Available behind nursery / `--with-nursery`; not enabled by default |

### Not implemented by plugin

| Plugin / source | Count |
| --- | ---: |
| `unicorn` | 172 |
| `@typescript-eslint` | 3 |

## Unsupported (do not keep eslint solely for these)

| Rule | Why oxlint skips it |
| --- | --- |
| `no-dupe-args` | Superseded by strict mode. |
| `no-octal` | Superseded by strict mode. |
| `unicorn/no-accidental-bitwise-operator` | No need to implement, already covered by `oxc/bad-bitwise-operator`. |
| `unicorn/no-boolean-sort-comparator` | No need to implement, TypeScript type checking requires array sort comparators to return numbers. |
| `unicorn/no-chained-comparison` | Use `oxc/bad-comparison-sequence` instead. TypeScript also reports errors for these comparisons. |
| `unicorn/no-collection-bracket-access` | No need to implement, TypeScript type checking reports invalid bracket access on `Map`, `Set`, `WeakMap`, and `WeakSet` values. |
| `unicorn/no-constant-zero-expression` | No need to implement, already covered by `oxc/erasing-op`. |
| `unicorn/no-double-comparison` | Use `oxc/double-comparisons` instead. |
| `unicorn/no-for-loop` | This rule suggests using `Array.prototype.entries` which is slow https://github.com/oxc-project/oxc/issues/11311, furthermore, `typescript/prefer-for-of` covers most cases. |
| `unicorn/no-invalid-argument-count` | No need to implement, TypeScript type checking reports invalid argument counts for functions, constructors, and built-in APIs. |
| `unicorn/no-invalid-character-comparison` | No need to implement, already covered by `oxc/bad-char-at-comparison`. |
| `unicorn/no-misrefactored-assignment` | No need to implement, already covered by `oxc/misrefactored-assign-op`. |
| `unicorn/no-named-default` | Implemented via `import/no-named-default`. |
| `unicorn/no-non-function-verb-prefix` | Requires type information. Not currently possible to implement in oxlint. |
| `unicorn/no-nonstandard-builtin-properties` | No need to implement, TypeScript type checking reports non-standard properties and invalid calls or constructions on built-ins. |
| `unicorn/no-shorthand-property-overrides` | Not currently possible, as it requires parsing standalone CSS files. |
| `unicorn/no-transition-all` | Not currently possible, as full support requires parsing standalone CSS files. |
| `unicorn/no-undeclared-class-members` | No need to implement, TypeScript type checking reports accesses to undeclared class members. |
| `unicorn/no-unnecessary-boolean-comparison` | No need to implement, already implemented by `typescript/no-unnecessary-boolean-literal-compare` via tsgolint. |
| `unicorn/no-unsafe-promise-all-settled-values` | No need to implement, TypeScript type checking reports accessing `value` on `Promise.allSettled()` results that have not been narrowed to the fulfilled variant. |
| `unicorn/no-useless-coercion` | No need to implement, already implemented by `typescript/no-unnecessary-type-conversion` via tsgolint. |
| `unicorn/no-useless-concat` | No need to implement separately; `eslint/no-useless-concat` already covers the diagnostics and will implement the suggestion fixer. |
| `unicorn/no-useless-template-literals` | No need to implement. `typescript/no-unnecessary-template-expression` covers static and already-string expressions, while `eslint/no-implicit-coercion` with `disallowTemplateShorthand` covers expression-only string coercions. |
| `unicorn/prefer-math-constants` | No need to implement, already covered by `oxc/approx-constant`. |
| `unicorn/require-array-sort-compare` | No need to implement, already implemented by `typescript/require-array-sort-compare` via tsgolint. |
| `unicorn/require-proxy-trap-boolean-return` | No need to implement, TypeScript type checking enforces boolean return types for the relevant `ProxyHandler` traps. |
| `unicorn/template-indent` | Stylistic rule. |
| `line-comment-position` | Deprecated stylistic rule, can be used via the stylistic eslint plugin as a JS Plugin if necessary. |

## Nursery (skipped unless explicitly enabled)

| Rule |
| --- |
| `no-undef` |
| `no-useless-assignment` |
| `@typescript-eslint/no-unnecessary-condition` |
| `@typescript-eslint/prefer-optional-chain` |
| `unicorn/no-useless-iterator-to-array` |
| `no-unreachable-loop` |

## Not implemented (eslint still needed)

Full list from migrate. Prefer eslint CI / PR gate for these until oxlint gains them.

| Rule |
| --- |
| `@typescript-eslint/no-unsafe-class-instance-assignment` |
| `unicorn/better-dom-traversing` |
| `unicorn/class-reference-in-static-methods` |
| `unicorn/consistent-compound-words` |
| `unicorn/consistent-conditional-object-spread` |
| `unicorn/consistent-export-decorator-position` |
| `unicorn/consistent-json-file-read` |
| `unicorn/consistent-optional-chaining` |
| `unicorn/consistent-tuple-labels` |
| `unicorn/default-export-style` |
| `unicorn/dom-node-dataset` |
| `unicorn/expiring-todo-comments` |
| `unicorn/isolated-functions` |
| `unicorn/logical-assignment-operators` |
| `unicorn/no-array-concat-in-loop` |
| `unicorn/no-array-from-fill` |
| `unicorn/no-array-sort-for-min-max` |
| `unicorn/no-array-splice` |
| `unicorn/no-async-iterator-callback` |
| `unicorn/no-blob-to-file` |
| `unicorn/no-break-in-nested-loop` |
| `unicorn/no-canvas-to-image` |
| `unicorn/no-conflicting-constraints` |
| `unicorn/no-confusing-array-splice` |
| `unicorn/no-declarations-before-early-exit` |
| `unicorn/no-duplicate-if-branches` |
| `unicorn/no-duplicate-logical-operands` |
| `unicorn/no-duplicate-loops` |
| `unicorn/no-duplicate-set-values` |
| `unicorn/no-error-property-assignment` |
| `unicorn/no-exports-in-scripts` |
| `unicorn/no-for-each` |
| `unicorn/no-global-object-property-assignment` |
| `unicorn/no-impossible-length-comparison` |
| `unicorn/no-incomplete-accessor-override` |
| `unicorn/no-incorrect-query-selector` |
| `unicorn/no-ineffective-csp-directives` |
| `unicorn/no-invalid-boolean-attribute-value` |
| `unicorn/no-invalid-dom-token` |
| `unicorn/no-invalid-integrity` |
| `unicorn/no-invalid-intl-options` |
| `unicorn/no-invalid-property-descriptor` |
| `unicorn/no-invalid-response-options` |
| `unicorn/no-invalid-style-set-property` |
| `unicorn/no-invalid-temporal-arithmetic` |
| `unicorn/no-invalid-url-protocol-comparison` |
| `unicorn/no-invalid-well-known-symbol-methods` |
| `unicorn/no-late-current-target-access` |
| `unicorn/no-late-event-control` |
| `unicorn/no-leading-empty-lines` |
| `unicorn/no-loop-iterable-mutation` |
| `unicorn/no-mismatched-map-key` |
| `unicorn/no-multiple-promise-resolver-calls` |
| `unicorn/no-negated-array-predicate` |
| `unicorn/no-negated-comparison` |
| `unicorn/no-object-methods-with-collections` |
| `unicorn/no-optional-chaining-on-undeclared-variable` |
| `unicorn/no-prevent-default-in-passive-listener` |
| `unicorn/no-redundant-comparison` |
| `unicorn/no-return-array-push` |
| `unicorn/no-selector-as-dom-name` |
| `unicorn/no-subtraction-comparison` |
| `unicorn/no-this-outside-of-class` |
| `unicorn/no-top-level-side-effects` |
| `unicorn/no-uncalled-method` |
| `unicorn/no-unnecessary-array-flat-map` |
| `unicorn/no-unnecessary-fetch-options` |
| `unicorn/no-unnecessary-nested-ternary` |
| `unicorn/no-unnecessary-parameters` |
| `unicorn/no-unnecessary-polyfills` |
| `unicorn/no-unnecessary-splice` |
| `unicorn/no-unnecessary-string-trim` |
| `unicorn/no-unreadable-for-of-expression` |
| `unicorn/no-unreadable-object-destructuring` |
| `unicorn/no-unsafe-buffer-conversion` |
| `unicorn/no-unsafe-json-serialization` |
| `unicorn/no-unsafe-property-key` |
| `unicorn/no-unsafe-sqlite-interpolation` |
| `unicorn/no-unsafe-string-replacement` |
| `unicorn/no-unused-builtin-method-return` |
| `unicorn/no-unused-iterator-helper` |
| `unicorn/no-url-in-search-params` |
| `unicorn/no-useless-boolean-cast` |
| `unicorn/no-useless-compound-assignment` |
| `unicorn/no-useless-continue` |
| `unicorn/no-useless-delete-check` |
| `unicorn/no-useless-else` |
| `unicorn/no-useless-logical-operand` |
| `unicorn/no-useless-override` |
| `unicorn/no-useless-re-export` |
| `unicorn/no-useless-recursion` |
| `unicorn/no-useless-set-construction` |
| `unicorn/no-using-resource-escape` |
| `unicorn/no-xor-as-exponentiation` |
| `unicorn/operator-assignment` |
| `unicorn/prefer-abort-signal-any` |
| `unicorn/prefer-abort-signal-timeout` |
| `unicorn/prefer-add-event-listener-options` |
| `unicorn/prefer-aggregate-error` |
| `unicorn/prefer-array-from-async` |
| `unicorn/prefer-array-from-map` |
| `unicorn/prefer-array-from-range` |
| `unicorn/prefer-array-iterable-methods` |
| `unicorn/prefer-array-last-methods` |
| `unicorn/prefer-array-slice` |
| `unicorn/prefer-await` |
| `unicorn/prefer-block-statement-over-iife` |
| `unicorn/prefer-boolean-return` |
| `unicorn/prefer-combined-guards` |
| `unicorn/prefer-continue` |
| `unicorn/prefer-direct-iteration` |
| `unicorn/prefer-dom-node-html-methods` |
| `unicorn/prefer-dom-node-replace-children` |
| `unicorn/prefer-early-return` |
| `unicorn/prefer-else-if` |
| `unicorn/prefer-escaped-irregular-whitespace` |
| `unicorn/prefer-flat-math-min-max` |
| `unicorn/prefer-get-or-insert-computed` |
| `unicorn/prefer-global-number-constants` |
| `unicorn/prefer-group-by` |
| `unicorn/prefer-has-check` |
| `unicorn/prefer-hoisting-branch-code` |
| `unicorn/prefer-https` |
| `unicorn/prefer-identifier-import-export-specifiers` |
| `unicorn/prefer-includes-over-repeated-comparisons` |
| `unicorn/prefer-iterable-in-constructor` |
| `unicorn/prefer-iterator-helpers` |
| `unicorn/prefer-iterator-to-array` |
| `unicorn/prefer-iterator-to-array-at-end` |
| `unicorn/prefer-iterator-zip` |
| `unicorn/prefer-literal-ascii` |
| `unicorn/prefer-map-from-entries` |
| `unicorn/prefer-math-abs` |
| `unicorn/prefer-minimal-ternary` |
| `unicorn/prefer-number-is-safe-integer` |
| `unicorn/prefer-object-destructuring-defaults` |
| `unicorn/prefer-object-iterable-methods` |
| `unicorn/prefer-observer-apis` |
| `unicorn/prefer-options-parameter` |
| `unicorn/prefer-path2d` |
| `unicorn/prefer-private-class-fields` |
| `unicorn/prefer-promise-static-methods` |
| `unicorn/prefer-promise-try` |
| `unicorn/prefer-promise-with-resolvers` |
| `unicorn/prefer-queue-microtask` |
| `unicorn/prefer-regexp-exec` |
| `unicorn/prefer-scoped-selector` |
| `unicorn/prefer-set-methods` |
| `unicorn/prefer-short-escape-sequences` |
| `unicorn/prefer-simple-sort-comparator` |
| `unicorn/prefer-simplified-conditions` |
| `unicorn/prefer-single-array-predicate` |
| `unicorn/prefer-single-object-destructuring` |
| `unicorn/prefer-single-replace` |
| `unicorn/prefer-smaller-scope` |
| `unicorn/prefer-string-match-all` |
| `unicorn/prefer-string-pad-start-end` |
| `unicorn/prefer-string-repeat` |
| `unicorn/prefer-switch` |
| `unicorn/prefer-temporal-conversion` |
| `unicorn/prefer-then-catch` |
| `unicorn/prefer-toggle-attribute` |
| `unicorn/prefer-type-literal-last` |
| `unicorn/prefer-unary-minus` |
| `unicorn/prefer-unicode-code-point-escapes` |
| `unicorn/prefer-url-can-parse` |
| `unicorn/prefer-url-search-parameters` |
| `unicorn/prefer-while-loop-condition` |
| `unicorn/require-passive-events` |
| `unicorn/require-spread-parentheses` |
| `unicorn/require-text-decoder-streaming` |
| `unicorn/consistent-destructuring` |
| `unicorn/no-unused-properties` |
| `@typescript-eslint/naming-convention` |
| `@typescript-eslint/prefer-destructuring` |

