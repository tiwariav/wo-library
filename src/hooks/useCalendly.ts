import { useEffectOnce } from "react-use";

import { CalendlyPopupWidgetOptionsPrefill } from "../../types/interfaces/calendly.js";
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

export interface CalendlyOptions {
  calendlyLink: string;
  prefill?: CalendlyPopupWidgetOptionsPrefill;
}

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
