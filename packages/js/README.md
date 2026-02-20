# @wo-library/js

Pure JavaScript/TypeScript utilities that work in any environment (browser, Node.js, etc).

## Installation

```bash
npm install @wo-library/js
# or
yarn add @wo-library/js
```

## Features

- Array utilities (`range`, `addOrUpdate`)
- Number formatting utilities (`formatNumber`, `formatNumberWithSuffix`, `ordinalNumber`)
- Object utilities (`pushOrCreate`, `getNestedValue`)
- Language utilities (`plularize`)
- Path utilities (`posixPath`)
- Time constants
- Miscellaneous utilities (`wait`, `isEmpty`, `inSubArray`)

## Usage

```typescript
import { range, formatNumber, wait } from "@wo-library/js";

// Array utilities
const numbers = range(1, 10, 1); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// Number formatting
const formatted = formatNumber(1234567.89); // "12,34,567.89" (Indian locale)

// Async utilities
await wait(1000); // Wait for 1 second
```

## License

MIT
