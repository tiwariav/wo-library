# @wo-library/web

Browser/DOM utilities. Peer-free runtime deps beyond `lodash-es`.

## Install

```bash
pnpm add @wo-library/web
```

## Function index

| Area | Exports |
| --- | --- |
| Clipboard | `copyToClipboard`, `copyImageToClipboard` |
| Images | `compressImage`, `fitWithin`, `shouldCompress`, `readExif`, `readExifFromFile`, `exifTakenAtToIso` |
| Capture | `collectCaptureMetadata`, `buildCaptureMetadata`, `classifyCaptureSource`, `probeCamera` |
| Navigation | `reloadOnceForChunkError`, `importWithRetry`, `runViewTransition`, `canSlide` |
| Forms / UI prefs | `readStoredTextSize`, `applyTextSizeToDom`, `readDraft`, `writeDraft`, `clearDraft` |
| CSV | `escapeCsvCell`, `downloadCsvFile`, `downloadRowsAsCsv`, `collectAllPages`, `downloadBlobFile` |
| Push | `enableWebPush`, `disableWebPush`, `getWebPushStatus` (pass `FirebaseWebPushConfig`) |
| Geo | `requestPosition`, `readGrantedPosition` |
| Fetch / storage | `fetch.WoFetch`, `storage.anyStorageInstance`, `loadScript`, `loadStylesheet` |
| Upload model | `UploadFile` |

```typescript
import { compressImage, copyToClipboard, enableWebPush } from "@wo-library/web";

await copyToClipboard("hello");
const smaller = await compressImage(file);
```

UI that wraps these lives in [`packages/registry`](../registry) (copy-paste via shadcn).

## License

MIT
