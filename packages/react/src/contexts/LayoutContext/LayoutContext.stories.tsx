import type { Meta, StoryObj } from "@storybook/react";

import {
  LayoutProvider,
  useLayoutMethods,
  useLayoutState,
} from "../../contexts/LayoutContext/index.js";

function LayoutConsumer() {
  const { sideNav, topNav } = useLayoutState();
  const { dispatch } = useLayoutMethods();

  return (
    <div>
      <h4>Layout State</h4>
      <p>
        SideNav toggled: <strong>{String(!!sideNav.isToggled)}</strong> |
        Compact: <strong>{String(!!sideNav.hasCompactMode)}</strong>
      </p>
      <p>
        TopNav hidden: <strong>{String(!!topNav.isHidden)}</strong> | Drawer:{" "}
        <strong>{String(!!topNav.isDrawerToggled)}</strong>
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <button
          onClick={() =>
            dispatch.updateSideNav({ isToggled: !sideNav.isToggled })
          }
          type="button"
        >
          Toggle SideNav
        </button>
        <button
          onClick={() =>
            dispatch.updateTopNav({
              isDrawerToggled: !topNav.isDrawerToggled,
            })
          }
          type="button"
        >
          Toggle TopNav Drawer
        </button>
        <button
          onClick={() => dispatch.updateTopNav({ isHidden: true })}
          type="button"
        >
          Hide TopNav
        </button>
        <button
          onClick={() => dispatch.updateTopNav({ isHidden: false })}
          type="button"
        >
          Show TopNav
        </button>
      </div>
    </div>
  );
}

function LayoutProviderDemo() {
  return (
    <LayoutProvider>
      <LayoutConsumer />
    </LayoutProvider>
  );
}

const metadata: Meta = {
  component: LayoutProviderDemo,
  parameters: {
    docs: {
      description: {
        component:
          "Layout context provider managing side navigation and top navigation state (toggled, hidden, compact, drawer). Includes refs to nav DOM elements.",
      },
    },
  },
  title: "Contexts/LayoutContext",
};

export default metadata;

type Story = StoryObj;

export const Default: Story = {
  render: () => <LayoutProviderDemo />,
};
