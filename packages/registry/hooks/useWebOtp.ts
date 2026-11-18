/* eslint-disable @typescript-eslint/no-unnecessary-condition -- OTP APIs vary by browser */

import { useEffect, useRef } from "react";

/** Settles sooner than this without a code → treat as unsupported, do not re-arm. */
export const WEB_OTP_MIN_REQUEST_MS = 2000;
/** Max re-arms after a settle with no code, per `requestKey`. */
export const WEB_OTP_MAX_REARMS = 5;

/**
 * WebOTP helper for Chrome Android SMS one-time codes.
 * Never throws: missing support, dismissals, and aborts are silent.
 */
export function useWebOtp(
  onCode: (code: string) => void,
  enabled = true,
  requestKey: number | string = 0,
): void {
  const onCodeRef = useRef(onCode);
  useEffect(() => {
    onCodeRef.current = onCode;
  });

  useEffect(() => {
    if (
      !enabled ||
      typeof window === "undefined" ||
      !("OTPCredential" in globalThis) ||
      !navigator.credentials?.get
    ) {
      return;
    }

    let stopped = false;
    let rearms = 0;
    let abort: AbortController | null = null;

    const arm = () => {
      const controller = new AbortController();
      abort = controller;
      const startedAt = Date.now();
      const settled = () => {
        if (
          stopped ||
          controller.signal.aborted ||
          Date.now() - startedAt < WEB_OTP_MIN_REQUEST_MS ||
          rearms >= WEB_OTP_MAX_REARMS
        ) {
          return;
        }
        rearms += 1;
        arm();
      };
      void navigator.credentials
        .get({
          otp: { transport: ["sms"] },
          signal: controller.signal,
        } as CredentialRequestOptions)
        .then((credential) => {
          if (stopped || controller.signal.aborted) {
            return;
          }
          const code = (credential as { code?: string } | null)?.code;
          if (code) {
            onCodeRef.current(code);
            return;
          }
          settled();
        })
        .catch(settled);
    };

    arm();
    return () => {
      stopped = true;
      abort?.abort();
    };
  }, [enabled, requestKey]);
}
