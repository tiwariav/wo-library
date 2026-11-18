import type { Meta, StoryObj } from "@storybook/react";
import { noop } from "lodash-es";

import { HoldButton } from "./hold-button.js";

const meta: Meta<typeof HoldButton> = {
  component: HoldButton,
  title: "registry/ui/HoldButton",
};
export default meta;

type Story = StoryObj<typeof HoldButton>;

export const Default: Story = {
  args: {
    children: "Hold to confirm",
    onConfirm: noop,
  },
};
