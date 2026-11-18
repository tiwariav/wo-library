import type { Meta, StoryObj } from "@storybook/react";

import { ArcProgress } from "./arc-progress.js";

const meta: Meta<typeof ArcProgress> = {
  component: ArcProgress,
  title: "registry/ui/ArcProgress",
};
export default meta;

type Story = StoryObj<typeof ArcProgress>;

export const Default: Story = {
  args: { label: "72%", value: 72 },
};
