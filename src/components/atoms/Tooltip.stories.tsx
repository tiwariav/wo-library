import { Meta, StoryObj } from "@storybook/react";

import { playFloatingBasic } from "../../tools/storybook/play.js";
import Tooltip from "./Tooltip.js";

const metadata: Meta<typeof Tooltip> = {
  component: Tooltip,
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
  render: (args) => <Tooltip {...args} />,
};
export const Open: Story = {
  args: {
    ...Basic.args,
    isOpen: true,
  },
  render: Basic.render,
};
export const Animated: Story = {
  args: {
    ...Basic.args,
    animate: true,
  },
  render: Basic.render,
};
export const WithArrow: Story = {
  args: {
    ...Basic.args,
    animate: true,
    showArrow: true,
  },
  render: Basic.render,
};
export const OnHover: Story = {
  args: {
    ...Basic.args,
    children: "Hover for Tooltip!",
    triggers: ["hover"],
  },
  render: Basic.render,
};
