import type { Meta, StoryObj } from "@storybook/react";

import Label from "./Label.js";

const metadata: Meta<typeof Label> = {
  component: Label,
  parameters: {
    docs: {
      description: {
        component:
          "Styled `<label>` element with support for required indicators, focus states, and value states. Renders nothing when `children` is falsy.",
      },
    },
  },
  title: "Atoms/Label",
};

export default metadata;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    children: "Email Address",
  },
};

export const Required: Story = {
  args: {
    children: "Username",
    required: true,
  },
};

export const RequiredWithText: Story = {
  args: {
    children: "Phone Number",
    required: "optional",
  },
};

export const WithFocus: Story = {
  args: {
    children: "Focused Label",
    withFocus: true,
  },
};

export const WithValue: Story = {
  args: {
    children: "Label with Value",
    withValue: true,
  },
};

export const AllStates: Story = {
  args: {
    children: "All States Active",
    required: true,
    withFocus: true,
    withValue: true,
  },
};
