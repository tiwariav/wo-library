import type { Placement } from "@floating-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import { useState } from "react";

import type { TooltipProps } from "./Tooltip.js";

import { playFloatingBasic } from "../../tools/storybook/play.js";
import Tooltip from "./Tooltip.js";

const metadata: Meta<typeof Tooltip> = {
  component: Tooltip,
  render: (args) => <Tooltip {...args} />,
};

export default metadata;

type Story = StoryObj<typeof Tooltip>;

const TOOLTIP_TEXT = "Content in Tooltip!";

export const Basic: Story = {
  args: {
    children: "Click for Tooltip!",
    title: TOOLTIP_TEXT,
  },
  play: async ({ canvasElement }) => {
    await playFloatingBasic(canvasElement, TOOLTIP_TEXT);
  },
};

export const Animated: Story = {
  args: {
    ...Basic.args,
    animate: true,
  },
};

export const IsOpen: Story = {
  args: {
    ...Basic.args,
    isOpen: true,
  },
};

export const IsPopover: Story = {
  args: {
    ...IsOpen.args,
    isPopover: true,
  },
};

export const ShowArrow: Story = {
  args: {
    ...IsOpen.args,
    animate: true,
    showArrow: true,
  },
};

export const Options: StoryObj<
  TooltipProps & { offset: number; padding: number }
> = {
  args: {
    ...IsOpen.args,
    offset: 16,
    padding: 16,
    showArrow: true,
  },
  argTypes: {
    offset: { control: { max: 32, min: 0, type: "range" } },
    padding: { control: { max: 32, min: 0, type: "range" } },
  },
  render: ({ offset, padding, ...args }) => (
    <Tooltip options={{ offset, padding }} {...args} />
  ),
};

const ALL_ALIGNMENTS = ["start", "end"];
function PlacementCell({
  placement,
  ...args
}: Omit<TooltipProps, "placement"> & { placement: string }) {
  return (
    <>
      <div>
        <Tooltip placement={placement as Placement} {...args}>
          Tooltip at {placement}!
        </Tooltip>
      </div>
      {ALL_ALIGNMENTS.map((alignment) => (
        <div key={alignment}>
          <Tooltip
            placement={`${placement}-${alignment}` as Placement}
            {...args}
          >
            Tooltip at {placement}-{alignment}!
          </Tooltip>
        </div>
      ))}
    </>
  );
}

export const Placements: Story = {
  args: {
    ...Basic.args,
    isOpen: true,
    showArrow: true,
  },
  render: (args) => (
    <div className="story-flex">
      <div className="story-flex-grow">
        <div className="story-title">Leftdiv</div>
        <div
          className="story-list"
          style={{
            gap: "1.5rem",
            paddingLeft: 120,
          }}
        >
          <PlacementCell placement="left" {...args} />
        </div>
      </div>
      <div className="story-flex-grow">
        <div className="story-title">Right</div>
        <div
          className="story-list"
          style={{
            gap: "1.5rem",
            paddingRight: 120,
          }}
        >
          <PlacementCell placement="right" {...args} />
        </div>
      </div>
      <div className="story-flex-grow">
        <div className="story-title">Top</div>
        <div
          className="story-list"
          style={{
            gap: "3rem",
            paddingTop: 32,
          }}
        >
          <PlacementCell placement="top" style={{ minWidth: 160 }} {...args} />
        </div>
      </div>
      <div className="story-flex-grow">
        <div className="story-title">Bottom</div>
        <div
          className="story-list"
          style={{
            gap: "3rem",
            paddingBottom: 32,
          }}
        >
          <PlacementCell
            placement="bottom"
            style={{ minWidth: 160 }}
            {...args}
          />
        </div>
      </div>
    </div>
  ),
};

export const Triggers: Story = {
  args: {
    ...Basic.args,
    placement: "bottom",
    showArrow: true,
  },
  render: (args) => (
    <div className="story-grid">
      <div>
        <Tooltip trigger="click" {...args}>
          Click for Tooltip!
        </Tooltip>
      </div>
      <div>
        <Tooltip trigger="hover" {...args}>
          Hover for Tooltip!
        </Tooltip>
      </div>
    </div>
  ),
};

function ButtonInDropdownTemplate() {
  const [open, setIsOpen] = useState(false);

  return (
    <Tooltip
      isOpen={open}
      onClick={() => {
        setIsOpen(true);
      }}
      onClose={() => {
        setIsOpen(false);
      }}
      title={
        <div>
          Content in Tooltip!
          <button
            onClick={() => {
              setIsOpen(false);
            }}
            style={{ marginLeft: "auto" }}
          >
            Close
          </button>
        </div>
      }
    >
      Content in Tooltip!
    </Tooltip>
  );
}

export const WithButton: Story = {
  render: () => <ButtonInDropdownTemplate />,
};

function ValidElementChildTemplate(args: Partial<TooltipProps>) {
  const [open, setIsOpen] = useState(false);
  const [tooltipCount, setTooltipCount] = useState(0);
  const [buttonCount, setButtonCount] = useState(0);

  return (
    <>
      <div>Tooltip clicked: {tooltipCount} times</div>
      <div>Button clicked: {buttonCount} times</div>
      <Tooltip
        isOpen={open}
        onClick={() => {
          setTooltipCount((previous) => previous + 1);
          setIsOpen(true);
        }}
        onClose={() => {
          setIsOpen(false);
        }}
        title={<div>Content in Tooltip!</div>}
        {...args}
      >
        <button
          onClick={() => {
            setButtonCount((previous) => previous + 1);
            setIsOpen(true);
          }}
        >
          Content in Tooltip!
        </button>
      </Tooltip>
    </>
  );
}

export const WithValidElement: Story = {
  args: {},
  render: ValidElementChildTemplate,
};
