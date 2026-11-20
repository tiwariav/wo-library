import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { ErrorNote } from "./error-note.js";

const meta: Meta<typeof ErrorNote> = {
  component: ErrorNote,
  title: "registry/ui/ErrorNote",
};
export default meta;

type Story = StoryObj<typeof ErrorNote>;

export const Default: Story = {
  args: { children: "The request timed out. Check your connection." },
};

export const WithRetry: Story = {
  args: {
    children: "Could not load items.",
    onRetry: fn(),
    title: "Load failed",
  },
};
