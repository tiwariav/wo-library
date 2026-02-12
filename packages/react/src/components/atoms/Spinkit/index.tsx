import type { ComponentPropsWithoutRef } from "react";

import LoaderWrapper from "../LoaderWrapper.js";
import Bounce from "./Bounce.js";
import Chase from "./Chase.js";
import CircleFadeDot from "./CircleFadeDot.js";
import DoubleBounce from "./DoubleBounce.js";

function getLoader(name: string, props?: ComponentPropsWithoutRef<"div">) {
  switch (name) {
    case "bounce": {
      return <Bounce {...props} />;
    }
    case "chase": {
      return <Chase {...props} />;
    }
    case "circle-fade-dot": {
      return <CircleFadeDot {...props} />;
    }
    case "double-bounce": {
      return <DoubleBounce {...props} />;
    }
    default: {
      return null;
    }
  }
}

export default function Spinkit({ name, ...props }: { name: string }) {
  return <LoaderWrapper>{getLoader(name, props)}</LoaderWrapper>;
}
