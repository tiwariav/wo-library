import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { useState } from "react";

import { PhoneInput } from "./phone-input.js";

const meta: Meta<typeof PhoneInput> = {
  component: PhoneInput,
  title: "registry/ui/PhoneInput",
};
export default meta;

type Story = StoryObj<typeof PhoneInput>;

function Controlled() {
  const [digits, setDigits] = useState("");
  return (
    <div className="flex flex-col gap-2">
      <PhoneInput
        onValueChange={setDigits}
        placeholder="Phone number"
        value={digits}
      />
      <span className="text-sm">Digits: {digits}</span>
    </div>
  );
}

export const Default: Story = {
  args: { onValueChange: fn(), value: "" },
  render: () => <Controlled />,
};
