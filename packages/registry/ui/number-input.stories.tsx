/* eslint-disable @typescript-eslint/no-magic-numbers */
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { NumberInput } from "./number-input.js";

function NumberInputDemo() {
  const [value, setValue] = useState<null | number>(1500);
  return (
    <div>
      <NumberInput onValueChange={setValue} value={value} />
      <p>Parsed: {value ?? "null"}</p>
    </div>
  );
}

const meta: Meta = {
  component: NumberInputDemo,
  title: "registry/ui/NumberInput",
};
export default meta;

type Story = StoryObj;

export const Default: Story = {};
