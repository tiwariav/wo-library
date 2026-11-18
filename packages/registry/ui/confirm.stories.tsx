import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Confirm } from "./confirm.js";

function ConfirmDemo() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button onClick={() => setOpen(true)} type="button">
        Open
      </button>
      <Confirm
        confirmLabel="Delete"
        destructive
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        open={open}
        title="Delete this item?"
        description="This cannot be undone."
      />
    </>
  );
}

const meta: Meta = {
  component: ConfirmDemo,
  title: "registry/ui/Confirm",
};
export default meta;

type Story = StoryObj;

export const Default: Story = {};
