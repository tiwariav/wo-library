import type { Meta, StoryObj } from "@storybook/react";

import { EmptyState } from "./empty-state.js";

const meta: Meta<typeof EmptyState> = {
  component: EmptyState,
  title: "registry/ui/EmptyState",
};
export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    action: { label: "Add item" },
    description: "Create your first item to get started.",
    guidance: {
      tips: ["Import a CSV", "Filter by date", "Invite a teammate"],
    },
    title: "Nothing here yet",
  },
};
