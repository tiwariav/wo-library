import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { Sheet } from "./sheet.js";

function SheetDemo() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button onClick={() => setOpen(true)} type="button">
        Open sheet
      </button>
      <Sheet onClose={() => setOpen(false)} open={open} title="Details">
        <p>Sheet body content.</p>
      </Sheet>
    </>
  );
}

const meta: Meta = {
  component: SheetDemo,
  title: "registry/ui/Sheet",
};
export default meta;

type Story = StoryObj;

export const Default: Story = {};
