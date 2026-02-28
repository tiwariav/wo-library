import { getUpdateStateMethod } from "../utils";

import type { ScrollState } from "./state.js";

export default function createScrollMethods(state: ScrollState) {
  return {
    updateState: getUpdateStateMethod(state),
  };
}
