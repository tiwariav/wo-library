import type { Meta, StoryObj } from "@storybook/react";

import Popover from "./Popover.js";

const metadata: Meta<typeof Popover> = {
  component: Popover,
  parameters: {
    docs: {
      description: {
        component:
          "Popover component built on top of Tooltip. Displays rich content in a floating panel triggered by hover or click.",
      },
    },
  },
  title: "Molecules/Popover",
};

export default metadata;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  args: {
    children: <button type="button">Hover me</button>,
    content: <div style={{ padding: "0.5rem" }}>Popover content goes here</div>,
  },
};

export const WithTitle: Story = {
  args: {
    children: <button type="button">Hover for details</button>,
    content: (
      <div style={{ padding: "0.5rem" }}>
        <p>This is the popover body with more detailed information.</p>
      </div>
    ),
    title: "Popover Title",
  },
};

export const RichContent: Story = {
  args: {
    children: <span style={{ textDecoration: "underline" }}>Hover text</span>,
    content: (
      <div style={{ padding: "0.5rem" }}>
        <h4 style={{ margin: "0 0 0.5rem" }}>Rich Content</h4>
        <p style={{ margin: 0 }}>Popovers support any React node as content.</p>
      </div>
    ),
  },
};
