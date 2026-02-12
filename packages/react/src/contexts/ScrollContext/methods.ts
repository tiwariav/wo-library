import { getUpdateStateMethod } from "wo-library/contexts/utils.js";

import type { ScrollState } from "./state.js";

export default function createScrollMethods(state: ScrollState) {
  return {
    updateState: getUpdateStateMethod(state),
  };
}
