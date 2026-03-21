import type { Meta, StoryObj } from "@storybook/react";

import Select from "./Select.js";

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Dragonfruit", value: "dragonfruit" },
];

const meta: Meta<typeof Select> = {
  component: Select,
  parameters: {
    docs: {
      description: {
        component: "A robust, accessible select component supporting single and multi-select modes.",
      },
    },
  },
  title: "Molecules/Select",
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    label: "Single Select",
    options,
  },
};

export const MultiSelect: Story = {
  args: {
    label: "Multi Select",
    multiple: true,
    options,
  },
};
