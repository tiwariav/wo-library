import { useEffectOnce } from "react-use";

import type { CalendlyPopupWidgetOptionsPrefill } from "../types/interfaces/calendly.js";

import { WoLoadScriptError } from "../tools/error/index.js";
import { loadScript, loadStylesheet } from "../tools/index.js";

async function loadCalendlyAssets() {
  const calendlyScript = await loadScript(
    "https://assets.calendly.com/assets/external/widget.js",
  );
  const calendlyStlyesheet = await loadStylesheet(
    "https://assets.calendly.com/assets/external/widget.css",
  );

  if (!(calendlyScript && calendlyStlyesheet)) {
    throw new WoLoadScriptError("Calendly SDK failed to load!");
  }
}

/**
 * Options for the {@link useCalendly} hook.
 *
 * @property calendlyLink - The full Calendly scheduling URL.
 * @property prefill - Optional prefill data (name, email, etc.) for the popup.
 */
export interface CalendlyOptions {
  calendlyLink: string;
  prefill?: CalendlyPopupWidgetOptionsPrefill;
}

/**
 * Loads the Calendly SDK on mount and returns a function to open the popup
 * scheduling widget.
 *
 * @param options - The Calendly link and optional prefill data.
 * @returns A function that opens the Calendly popup widget when called.
 *
 * @example
 * ```tsx
 * function BookButton() {
 *   const openCalendly = useCalendly({ calendlyLink: "https://calendly.com/user/meeting" });
 *   return <button onClick={openCalendly}>Book a Meeting</button>;
 * }
 * ```
 */
export default function useCalendly({
  calendlyLink,
  prefill,
}: CalendlyOptions) {
  useEffectOnce(() => {
    void loadCalendlyAssets();
  });

  return () => {
    window.Calendly.initPopupWidget({ prefill, url: calendlyLink });
  };
}
