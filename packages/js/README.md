# @wo-library/js

Pure TypeScript utilities for any environment (browser, Node.js, workers).

## Install

```bash
pnpm add @wo-library/js
```

## Function index

| Area | Exports |
| --- | --- |
| Arrays | `range`, `addOrUpdate` |
| Numbers | `formatNumber`, `formatNumberWithSuffix`, `ordinalNumber`, `stringToNumber`, `parseFormattedNumber` |
| Indian display | `groupIndian`, `stripGrouping`, `sanitizeNumberText`, `formatCount`, `formatPercent`, `formatWithUnit`, `numberToWords` |
| Dates / time | `formatRelativeTime`, `formatWhen`, `formatDay`, `formatClock`, `formatDayTime`, `dateLocaleFor`, `intlLocaleFor`, `getDatePresetRange`, `rollingDays`, `startOfFinancialYear`, `toLocalDateKey`, `wallClockOf`, `istDayRangeUtc`, `inTimeWindow`, `minutesOfDay` |
| Geo / polyline | `metresBetween`, `bearingDegrees`, `encodePolyline`, `decodePolyline` |
| Text / names | `normalizeCode`, `nameOverlap`, `uniqueName`, `normalisedName` |
| Phone | `getFlagEmoji`, `normalizePhoneDigits`, `phoneMatchForms` |
| Errors | `safeError`, `safeErrSerializer`, `AppError`, `NotFoundError`, `BadRequestError`, … |
| Misc | `debounce`, `wait`, `isEmpty`, `posixPath`, SVG/`progress` geometry helpers |

```typescript
import { formatCurrency, groupIndian, metresBetween } from "@wo-library/js";

formatCurrency(1500); // "₹1,500.00"
groupIndian("1234567"); // "12,34,567"
metresBetween({ lat: 28.61, lng: 77.2 }, { lat: 28.62, lng: 77.21 });
```

## License

MIT
