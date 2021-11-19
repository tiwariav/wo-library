import { useEffectOnce } from "react-use";
import { Button } from "ye-ui/components/atoms/forms";
import loadScript from "../../lib/loadScript";
import loadStylesheet from "../../lib/loadStylesheet";
import { WoLoadScriptError } from "../../utils/error";

export default function Calendly({ onClick, calendlyLink, prefill, ...props }) {
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

  const handleClick = (event) => {
    window.Calendly.initPopupWidget({ url: calendlyLink, prefill });
    if (onClick) {
      onClick(event);
    }
  };

  return <Button onClick={handleClick} {...props} />;
}
