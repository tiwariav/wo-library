import type { Meta, StoryObj } from "@storybook/react";

import ArcProgress from "./ArcProgress.js";

const meta: Meta<typeof ArcProgress> = {
  args: {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    progress: [50, 100],
  },
  component: ArcProgress,
  render: (args) => <ArcProgress {...args} />,
};

export default meta;

type Story = StoryObj<typeof ArcProgress>;

export const Basic: Story = {};

export const Segments: Story = {
  render: (args) => (
    <div className="story-grid">
      <ArcProgress segments={1} {...args} />
      <ArcProgress segments={5} {...args} />
      <ArcProgress segments={10} {...args} />
    </div>
  ),
};

/* jscpd:ignore-start */
export const StrokeWidth: Story = {
  render: (args) => (
    <div className="story-grid">
      <ArcProgress strokeWidth={1} {...args} />
      <ArcProgress strokeWidth={5} {...args} />
      <ArcProgress strokeWidth={10} {...args} />
    </div>
  ),
};
/* jscpd:ignore-end */

export const Text: Story = {
  args: {
    children: " Pigs",
  },
};
