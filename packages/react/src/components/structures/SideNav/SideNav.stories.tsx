import type { Meta, StoryObj } from "@storybook/react";
import type { ComponentProps } from "react";

import { IconMenu } from "@tabler/icons-react";
import { randomGradientGenerator } from "wo-library/tools/colors.js";

import {
  LayoutProvider,
  useLayoutMethods,
  useLayoutState,
} from "../../../contexts/LayoutContext/index.js";
import Lorem from "../../../vendors/Lorem.js";
import { BasicSideNav } from "../../__stories/SideNavTemplates.js";
import Button from "../../atoms/Button/Button.js";
import SideNav, { SideNavToggle } from "./SideNav.js";
import { SideNavTitle } from "./SideNavGroup.js";

function SideNavButton({ ...props }) {
  const {
    sideNav: { isToggled },
  } = useLayoutState();
  const {
    dispatch: { updateSideNav },
  } = useLayoutMethods();

  return (
    <Button
      variant="borderless"
      {...props}
      onClick={() => {
        updateSideNav({ isToggled: !isToggled });
      }}
    >
      <IconMenu />
    </Button>
  );
}

function Template(args: ComponentProps<typeof BasicSideNav>) {
  return (
    <LayoutProvider>
      <div
        className="story-bg-container story-flex"
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        style={{ backgroundImage: randomGradientGenerator(20) }}
      >
        <div className="story-flex">
          <BasicSideNav {...args} />
        </div>
        <div>
          <SideNavButton />
          <div style={{ maxWidth: 400 }}>
            <Lorem count={10} units="paragraphs" />
          </div>
        </div>
      </div>
    </LayoutProvider>
  );
}

const metadata: Meta<typeof SideNav> = {
  component: SideNav,
  render: Template,
};

export default metadata;

type Story = StoryObj<typeof SideNav>;

export const Basic: Story = {};

export const Sticky: Story = {
  args: { sticky: true },
  render: (args) => (
    <div className="story-flex">
      <Template
        {...args}
        toggleIcon={
          <SideNavTitle icon={<SideNavToggle />}>Sticky</SideNavTitle>
        }
      />
      <Template
        groups={3}
        {...args}
        sticky={{ bottom: true }}
        toggleIcon={
          <SideNavTitle icon={<SideNavToggle />}>Sticky Bottom</SideNavTitle>
        }
      />
    </div>
  ),
};
export const FullHeight: Story = {
  args: { isFullHeight: true },
};

export const CompactMode: Story = {
  args: { hasCompactMode: false },
};
