/* eslint-disable no-await-in-loop, max-statements, unicorn/no-duplicate-if-branches, lodash/prefer-lodash-typecheck -- pagination + CSV normalisation */
/**
 * CSV escape/download helpers and paginated collect (no HTTP client coupling).
 */

import { isBoolean, isDate, isNil } from "lodash-es";

export type CsvCell = boolean | Date | null | number | string | undefined;

export interface CsvColumn<T> {
  label: string;
  exportValue: (row: T) => CsvCell;
}

export function escapeCsvCell(value: CsvCell): string {
  if (isNil(value)) {
    return "";
  }
  let normalized: string;
  if (isDate(value)) {
    normalized = value.toISOString();
  } else if (isBoolean(value)) {
    normalized = String(value);
  } else {
    normalized = String(value);
  }
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replaceAll('"', '""')}"`;
  }
  return normalized;
}

/** Prevent spreadsheet formula injection when the CSV is opened. */
export function neutralizeCsvFormula(value: string): string {
  const flat = value.replaceAll(/[\n\r]+/g, " ");
  return /^\s*[=+\-@]/.test(flat) || flat.startsWith("\t") ? `'${flat}` : flat;
}

export function downloadCsvFile(
  fileName: string,
  headers: string[],
  rows: CsvCell[][],
): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const content = [headers, ...rows]
    .map((row) => row.map((cell) => escapeCsvCell(cell)).join(","))
    .join("\n");
  const blob = new Blob([`${content}\n`], { type: "text/csv;charset=utf-8;" });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.setAttribute("download", fileName);
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
  return true;
}

export function downloadRowsAsCsv<T>({
  columns,
  fileName,
  rows,
}: {
  columns: CsvColumn<T>[];
  fileName: string;
  rows: T[];
}): boolean {
  const headers = columns.map((column) => column.label);
  const serialized = rows.map((row) =>
    columns.map((column) => column.exportValue(row)),
  );
  return downloadCsvFile(fileName, headers, serialized);
}

export interface PaginatedResult<T> {
  count?: number;
  data: T[];
}

export async function collectAllPages<T>(
  fetchPage: (options: {
    limit: number;
    offset: number;
  }) => Promise<PaginatedResult<T>>,
  pageSize = 200,
): Promise<T[]> {
  const items: T[] = [];
  let offset = 0;
  for (;;) {
    const page = await fetchPage({ limit: pageSize, offset });
    const pageItems = Array.isArray(page.data) ? page.data : [];
    items.push(...pageItems);
    if (pageItems.length < pageSize) {
      break;
    }
    if (typeof page.count === "number" && items.length >= page.count) {
      break;
    }
    offset += pageSize;
  }
  return items;
}

/** Trigger a download from an already-fetched Blob. */
export function downloadBlobFile(
  blob: Blob,
  defaultFilename: string,
  revokeAfterMs = 60_000,
): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const objectUrl = URL.createObjectURL(blob);
  const isIos =
    typeof navigator !== "undefined" &&
    /iP(ad|hone|od)/.test(navigator.userAgent) &&
    !/CriOS|FxiOS/.test(navigator.userAgent);

  if (isIos) {
    window.open(objectUrl, "_blank", "noopener");
  } else {
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.setAttribute("download", defaultFilename);
    anchor.rel = "noopener";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
  }
  globalThis.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, revokeAfterMs);
  return true;
}
