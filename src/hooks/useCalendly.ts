import { useEffectOnce } from "react-use";
import { loadScript, loadStylesheet } from "../tools/index.js";
import { WoLoadScriptError } from "../utils/error.js";

async function loadCalendlyAssets() {
  const calendlyScript = await loadScript(
    "https://assets.calendly.com/assets/external/widget.js"
  );
  const calendlyStlyesheet = await loadStylesheet(
    "https://assets.calendly.com/assets/external/widget.css"
  );

  if (!(calendlyScript && calendlyStlyesheet)) {
    throw new WoLoadScriptError("Calendly SDK failed to load!");
  }
}

export default function useCalendly({ calendlyLink, prefill }) {
  useEffectOnce(() => {
    loadCalendlyAssets();
  });

  return () => {
    window.Calendly.initPopupWidget({ url: calendlyLink, prefill });
  };
}
