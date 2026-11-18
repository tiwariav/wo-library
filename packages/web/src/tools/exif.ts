/* eslint-disable @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-unnecessary-condition, max-statements, sonarjs/cognitive-complexity, sonarjs/no-nested-conditional -- TIFF/EXIF parser */
/**
 * Read JPEG EXIF `DateTimeOriginal` and GPS. Call on the original file before
 * any canvas re-encode (compression drops APP1).
 */

/* eslint-disable @typescript-eslint/no-magic-numbers -- TIFF/EXIF tag codes and type sizes */

export interface ExifCapture {
  /** `DateTimeOriginal` as wall-clock `YYYY-MM-DDTHH:MM:SS` (no zone). */
  takenAt?: string;
  /** `OffsetTimeOriginal`, e.g. `+05:30`. */
  offset?: string;
  latitude?: number;
  longitude?: number;
}

/** APP1 sits near the front; this is more than enough. */
export const EXIF_READ_BYTES = 256 * 1024;

const TAG_EXIF_IFD = 0x87_69;
const TAG_GPS_IFD = 0x88_25;
const TAG_DATETIME_ORIGINAL = 0x90_03;
const TAG_OFFSET_TIME_ORIGINAL = 0x90_11;
const TAG_GPS_LATITUDE_REF = 0x00_01;
const TAG_GPS_LATITUDE = 0x00_02;
const TAG_GPS_LONGITUDE_REF = 0x00_03;
const TAG_GPS_LONGITUDE = 0x00_04;

const TYPE_ASCII = 2;
const TYPE_LONG = 4;
const TYPE_RATIONAL = 5;

const TYPE_SIZES: Record<number, number> = {
  1: 1,
  10: 8,
  2: 1,
  3: 2,
  4: 4,
  5: 8,
  7: 1,
  9: 4,
};

interface IfdEntry {
  type: number;
  count: number;
  pos: number;
}

function readIfd(
  view: DataView,
  start: number,
  le: boolean,
): Map<number, IfdEntry> | null {
  if (start <= 0 || start + 2 > view.byteLength) {
    return null;
  }
  const count = view.getUint16(start, le);
  const entries = new Map<number, IfdEntry>();
  for (let i = 0; i < count; i += 1) {
    const base = start + 2 + i * 12;
    if (base + 12 > view.byteLength) {
      break;
    }
    const tag = view.getUint16(base, le);
    const type = view.getUint16(base + 2, le);
    const valueCount = view.getUint32(base + 4, le);
    const size = TYPE_SIZES[type];
    if (!size) {
      continue;
    }
    const total = size * valueCount;
    if (total > view.byteLength) {
      continue;
    }
    const pos = total <= 4 ? base + 8 : view.getUint32(base + 8, le);
    if (pos + total > view.byteLength) {
      continue;
    }
    entries.set(tag, { count: valueCount, pos, type });
  }
  return entries;
}

function readAscii(
  view: DataView,
  entry: IfdEntry | undefined,
): string | undefined {
  if (!entry || entry.type !== TYPE_ASCII) {
    return undefined;
  }
  let out = "";
  for (let i = 0; i < entry.count; i += 1) {
    const code = view.getUint8(entry.pos + i);
    if (code === 0) {
      break;
    }
    out += String.fromCodePoint(code);
  }
  return out;
}

function readPointer(
  view: DataView,
  entry: IfdEntry | undefined,
  le: boolean,
): number {
  if (!entry || entry.type !== TYPE_LONG || entry.count < 1) {
    return 0;
  }
  return view.getUint32(entry.pos, le);
}

function readDegrees(
  view: DataView,
  entry: IfdEntry | undefined,
  le: boolean,
): number | undefined {
  if (!entry || entry.type !== TYPE_RATIONAL || entry.count < 3) {
    return undefined;
  }
  const parts: number[] = [];
  for (let i = 0; i < 3; i += 1) {
    const numerator = view.getUint32(entry.pos + i * 8, le);
    const denominator = view.getUint32(entry.pos + i * 8 + 4, le);
    if (denominator === 0) {
      return undefined;
    }
    parts.push(numerator / denominator);
  }
  const [degrees = 0, minutes = 0, seconds = 0] = parts;
  const value = degrees + minutes / 60 + seconds / 3600;
  return Number.isFinite(value) ? value : undefined;
}

function parseExifDate(raw: string | undefined): string | undefined {
  if (!raw) {
    return undefined;
  }
  const match = /^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/.exec(
    raw.trim(),
  );
  if (!match) {
    return undefined;
  }
  const [, year, month, day, hour, minute, second] = match;
  if (year === "0000" || month === "00" || day === "00") {
    return undefined;
  }
  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

function parseTiff(view: DataView): ExifCapture | null {
  if (view.byteLength < 8) {
    return null;
  }
  const order = view.getUint16(0, false);
  const le = order === 0x49_49 ? true : order === 0x4d_4d ? false : null;
  if (le === null || view.getUint16(2, le) !== 42) {
    return null;
  }

  const ifd0 = readIfd(view, view.getUint32(4, le), le);
  if (!ifd0) {
    return null;
  }

  const result: ExifCapture = {};

  const exifIfd = readIfd(
    view,
    readPointer(view, ifd0.get(TAG_EXIF_IFD), le),
    le,
  );
  if (exifIfd) {
    const takenAt = parseExifDate(
      readAscii(view, exifIfd.get(TAG_DATETIME_ORIGINAL)),
    );
    if (takenAt) {
      result.takenAt = takenAt;
      const offset = readAscii(
        view,
        exifIfd.get(TAG_OFFSET_TIME_ORIGINAL),
      )?.trim();
      if (offset && /^[+-]\d{2}:\d{2}$/.test(offset)) {
        result.offset = offset;
      }
    }
  }

  const gpsIfd = readIfd(
    view,
    readPointer(view, ifd0.get(TAG_GPS_IFD), le),
    le,
  );
  if (gpsIfd) {
    const lat = readDegrees(view, gpsIfd.get(TAG_GPS_LATITUDE), le);
    const lon = readDegrees(view, gpsIfd.get(TAG_GPS_LONGITUDE), le);
    const latRef = readAscii(
      view,
      gpsIfd.get(TAG_GPS_LATITUDE_REF),
    )?.toUpperCase();
    const lonRef = readAscii(
      view,
      gpsIfd.get(TAG_GPS_LONGITUDE_REF),
    )?.toUpperCase();
    if (lat !== undefined && lon !== undefined) {
      const latitude = latRef === "S" ? -lat : lat;
      const longitude = lonRef === "W" ? -lon : lon;
      const valid =
        Math.abs(latitude) <= 90 &&
        Math.abs(longitude) <= 180 &&
        !(latitude === 0 && longitude === 0);
      if (valid) {
        result.latitude = latitude;
        result.longitude = longitude;
      }
    }
  }

  return result.takenAt || result.latitude !== undefined ? result : null;
}

/** Parse JPEG bytes; never throws on truncated/malformed input. */
export function readExif(buffer: ArrayBuffer): ExifCapture | null {
  try {
    const view = new DataView(buffer);
    if (view.byteLength < 4 || view.getUint16(0, false) !== 0xff_d8) {
      return null;
    }
    let offset = 2;
    while (offset + 4 <= view.byteLength) {
      if (view.getUint8(offset) !== 0xff) {
        return null;
      }
      const marker = view.getUint8(offset + 1);
      if (marker === 0xff) {
        offset += 1;
        continue;
      }
      if (marker === 0xda || marker === 0xd9) {
        return null;
      }
      const length = view.getUint16(offset + 2, false);
      if (length < 2) {
        return null;
      }
      const isExif =
        marker === 0xe1 &&
        offset + 10 <= view.byteLength &&
        view.getUint32(offset + 4, false) === 0x45_78_69_66 &&
        view.getUint16(offset + 8, false) === 0;
      if (isExif) {
        const tiffStart = offset + 10;
        const tiffEnd = Math.min(view.byteLength, offset + 2 + length);
        if (tiffEnd <= tiffStart) {
          return null;
        }
        return parseTiff(new DataView(buffer, tiffStart, tiffEnd - tiffStart));
      }
      offset += 2 + length;
    }
    return null;
  } catch {
    return null;
  }
}

/** EXIF wall time → ISO instant (uses offset when present). */
export function exifTakenAtToIso(
  exif: ExifCapture | null | undefined,
): string | undefined {
  if (!exif?.takenAt) {
    return undefined;
  }
  const date = new Date(
    exif.offset ? `${exif.takenAt}${exif.offset}` : exif.takenAt,
  );
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/** Read the head of a Blob; non-JPEGs return null. */
export async function readExifFromFile(
  file: Blob,
): Promise<ExifCapture | null> {
  const name = (file as File).name ?? "";
  if (file.type !== "image/jpeg" && !/\.jpe?g$/i.test(name)) {
    return null;
  }
  try {
    return readExif(await file.slice(0, EXIF_READ_BYTES).arrayBuffer());
  } catch {
    return null;
  }
}
