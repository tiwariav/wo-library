import type { ComponentPropsWithoutRef, ReactElement } from "react";

import LoaderWrapper from "../LoaderWrapper.js";
import Bounce from "./Bounce.js";
import Chase from "./Chase.js";
import CircleFadeDot from "./CircleFadeDot.js";
import DoubleBounce from "./DoubleBounce.js";

function getLoader(
  name: string,
  props?: Readonly<ComponentPropsWithoutRef<"div">>,
): ReactElement | null {
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

export default function Spinkit({
  name,
  ...props
}: Readonly<{ name: string }>): ReactElement {
  return <LoaderWrapper>{getLoader(name, props)}</LoaderWrapper>;
}
