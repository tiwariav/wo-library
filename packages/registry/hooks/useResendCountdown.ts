/* eslint-disable max-statements -- deadline + storage + tick state */

import { isNumber } from "lodash-es";
import { useCallback, useEffect, useState } from "react";

const DEFAULT_STORAGE_PREFIX = "app:resend-at:";
const MS_PER_SECOND = 1000;

function readDeadline(key: string | null, prefix: string): number {
  if (!key) {
    return 0;
  }
  try {
    const raw = Number(sessionStorage.getItem(prefix + key));
    return Number.isFinite(raw) ? raw : 0;
  } catch {
    return 0;
  }
}

function writeDeadline(key: string | null, deadline: number, prefix: string) {
  if (!key) {
    return;
  }
  try {
    if (deadline > Date.now()) {
      sessionStorage.setItem(prefix + key, String(deadline));
    } else {
      sessionStorage.removeItem(prefix + key);
    }
  } catch {
    /* storage unavailable — countdown still runs for this page life */
  }
}

const secondsUntil = (deadline: number) =>
  Math.max(0, Math.ceil((deadline - Date.now()) / MS_PER_SECOND));

export interface UseResendCountdownOptions {
  /** Prefixed sessionStorage key namespace. */
  storagePrefix?: string;
  /** ISO string or epoch ms reported by the server. */
  serverAvailableAt?: null | number | string;
}

/**
 * "Resend in Ns" countdown kept as a deadline (survives reload via sessionStorage).
 */
export function useResendCountdown(
  key: string | null,
  options: UseResendCountdownOptions = {},
): {
  secondsLeft: number;
  startCountdown: (seconds: number) => void;
} {
  const { serverAvailableAt, storagePrefix = DEFAULT_STORAGE_PREFIX } = options;
  const [deadline, setDeadline] = useState(() =>
    readDeadline(key, storagePrefix),
  );

  const [trackedKey, setTrackedKey] = useState(key);
  if (trackedKey !== key) {
    setTrackedKey(key);
    setDeadline(readDeadline(key, storagePrefix));
  }

  let serverDeadline = 0;
  if (serverAvailableAt != null) {
    serverDeadline = isNumber(serverAvailableAt)
      ? serverAvailableAt
      : Date.parse(serverAvailableAt) || 0;
  }
  const effective = Math.max(deadline, serverDeadline);

  const [secondsLeft, setSecondsLeft] = useState(() => secondsUntil(effective));
  const [trackedEffective, setTrackedEffective] = useState(effective);
  if (trackedEffective !== effective) {
    setTrackedEffective(effective);
    setSecondsLeft(secondsUntil(effective));
  }

  useEffect(() => {
    if (secondsUntil(effective) <= 0) {
      return;
    }
    const timer = setInterval(() => {
      const left = secondsUntil(effective);
      setSecondsLeft(left);
      if (left <= 0) {
        clearInterval(timer);
      }
    }, MS_PER_SECOND);
    return () => {
      clearInterval(timer);
    };
  }, [effective]);

  const startCountdown = useCallback(
    (seconds: number) => {
      if (seconds <= 0) {
        return;
      }
      const next = Date.now() + seconds * MS_PER_SECOND;
      setDeadline((prev) => {
        const merged = Math.max(prev, next);
        writeDeadline(key, merged, storagePrefix);
        return merged;
      });
    },
    [key, storagePrefix],
  );

  return { secondsLeft, startCountdown };
}
