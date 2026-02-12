import type { Meta, StoryObj } from "@storybook/react";

import CircleProgress from "./CircleProgress.js";
import * as styles from "./circleProgress.stories.module.css";

const metadata: Meta<typeof CircleProgress> = {
  args: {
    arcHeight: 100,
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    progress: [25, 100],
    progressText: "percent",
    squareSize: 100,
    strokeWidth: 4,
  },
  argTypes: {
    arcHeight: { control: { max: 100, min: 0, type: "range" } },
    strokeWidth: { control: { max: 100, min: 0, type: "range" } },
  },
  component: CircleProgress,
  render: (args) => <CircleProgress {...args} />,
};

export default metadata;

type Story = StoryObj<typeof CircleProgress>;

export const Basic: Story = {};

export const ArcHeight: Story = {
  render: (args) => (
    <div className="story-grid">
      <CircleProgress {...args} />
      <CircleProgress {...args} arcHeight={67} />
      <CircleProgress {...args} arcHeight={50} />
      <CircleProgress {...args} arcHeight={20} />
    </div>
  ),
};

export const Progress: Story = {
  render: (args) => (
    <div className="story-grid">
      {/* eslint-disable-next-line @typescript-eslint/no-magic-numbers */}
      <CircleProgress {...args} progress={[0, 10]} />
      <CircleProgress {...args} />
      <CircleProgress {...args} progress={[1, 1]} />
    </div>
  ),
};

export const ProgressText: Story = {
  render: (args) => (
    <div className="story-grid">
      <CircleProgress {...args} progressText="parts" />
      <CircleProgress {...args} progressText="percent" />
      <CircleProgress {...args} progressText="value" />
      <CircleProgress {...args} progressText="pigs" />
    </div>
  ),
};

export const SquareSize: Story = {
  render: (args) => (
    <div className="story-grid">
      <CircleProgress {...args} squareSize={16} />
      <CircleProgress {...args} squareSize={48} />
      <CircleProgress {...args} squareSize={200} />
    </div>
  ),
};

export const StrokeWidth: Story = {
  render: (args) => (
    <div className="story-grid">
      <CircleProgress {...args} strokeWidth={1} />
      <CircleProgress {...args} />
      <CircleProgress {...args} strokeWidth={5} />
      <CircleProgress {...args} strokeWidth={15} />
    </div>
  ),
};

export const Color: Story = {
  render: (args) => (
    <div className="story-grid">
      <CircleProgress
        {...args}
        innerClassNames={{
          progressPartial: styles.redProgress,
        }}
      />
      <CircleProgress
        {...args}
        innerClassNames={{
          progressPartial: styles.greenProgress,
        }}
      />
      <CircleProgress
        {...args}
        innerClassNames={{
          progressPartial: styles.orangeProgress,
        }}
      />
    </div>
  ),
};
