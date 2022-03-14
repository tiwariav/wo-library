import { useEffectOnce } from "react-use";
import { loadScript, loadStylesheet } from "../lib";
import { WoLoadScriptError } from "../utils/error";

export default function useCalendly({ calendlyLink, prefill }) {
  useEffectOnce(async () => {
    const calendlyScript = await loadScript(
      "https://assets.calendly.com/assets/external/widget.js"
    );
    const calendlyStlyesheet = await loadStylesheet(
      "https://assets.calendly.com/assets/external/widget.css"
    );

    if (!(calendlyScript && calendlyStlyesheet)) {
      throw new WoLoadScriptError("Calendly SDK failed to load!");
    }
  });

  return () => {
    window.Calendly.initPopupWidget({ url: calendlyLink, prefill });
  };
}
