import type { OverlayScrollbarsComponentRef } from "overlayscrollbars-react";

export interface ScrollState {
  overlayScrollbars: OverlayScrollbarsComponentRef | null;
}

const INITIAL_SCROLL_STATE: ScrollState = {
  overlayScrollbars: null,
};

export default INITIAL_SCROLL_STATE;
