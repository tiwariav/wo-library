export interface LayoutState {
  sideNav: {
    hasCompactMode?: boolean;
    isToggled?: boolean;
  };
  topNav: {
    isDrawerToggled?: boolean;
    isHidden?: boolean;
  };
}

const INITIAL_LAYOUT_STATE: LayoutState = {
  sideNav: {},
  topNav: {},
};

export default INITIAL_LAYOUT_STATE;
