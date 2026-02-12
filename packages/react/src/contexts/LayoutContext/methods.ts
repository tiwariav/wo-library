import { getUpdateStateMethod } from "wo-library/contexts/utils.js";

import type { LayoutState } from "./state.js";

export default function createLayoutMethods(state: LayoutState) {
  return {
    updateSideNav: (sideNavState: LayoutState["sideNav"]) => {
      return {
        ...state,
        sideNav: { ...state.sideNav, ...sideNavState },
      };
    },
    updateState: getUpdateStateMethod(state),
    updateTopNav: (topNavState: LayoutState["topNav"]) => {
      return {
        ...state,
        topNav: { ...state.topNav, ...topNavState },
      };
    },
  };
}

export type LayoutMethods = ReturnType<typeof createLayoutMethods>;
