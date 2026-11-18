/**
 * Time-of-day windows that may cross midnight (e.g. 20:00–06:00).
 */

import { isNil } from "lodash-es";

const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;

/** `"20:30"` → minutes after midnight; `null` for invalid input. */
export function minutesOfDay(hm: null | string | undefined): null | number {
  const match = /^(\d{1,2}):(\d{2})$/.exec((hm ?? "").trim());
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours < HOURS_PER_DAY && minutes < MINUTES_PER_HOUR
    ? hours * MINUTES_PER_HOUR + minutes
    : null;
}

export interface TimeWindow {
  from: null | string;
  to: null | string;
}

/** True when both ends parse as times. */
export function timeWindowActive(window: TimeWindow): boolean {
  return minutesOfDay(window.from) !== null && minutesOfDay(window.to) !== null;
}

/**
 * Whether a moment falls in the window.
 * `from ≤ to` is same-day inclusive; `from > to` crosses midnight.
 * Incomplete windows let everything through; missing/invalid moments fail an
 * active window.
 */
export function inTimeWindow(
  at: null | number | string | undefined,
  window: TimeWindow,
): boolean {
  const from = minutesOfDay(window.from);
  const to = minutesOfDay(window.to);
  if (from === null || to === null) {
    return true;
  }
  if (isNil(at)) {
    return false;
  }
  const date = new Date(at);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  const minutes = date.getHours() * MINUTES_PER_HOUR + date.getMinutes();
  return from <= to
    ? minutes >= from && minutes <= to
    : minutes >= from || minutes <= to;
}
