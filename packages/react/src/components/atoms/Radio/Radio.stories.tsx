import type { Meta, StoryObj } from "@storybook/react";

import Radio from "./Radio.js";

const meta: Meta<typeof Radio> = {
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
  },
  component: Radio,
  parameters: {
    docs: {
      description: {
        component: "A standard radio input component for mutual-exclusion selection.",
      },
    },
  },
  title: "Atoms/Radio",
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  args: {
    label: "Option 1",
    name: "example",
    value: "1",
  },
};

export const Group: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <Radio {...args} label="Option 1" value="1" />
      <Radio {...args} label="Option 2" value="2" />
      <Radio {...args} label="Option 3" value="3" />
    </div>
  ),
};
