import type { Meta } from "@storybook/react";

import PasswordInput from "./PasswordInput.js";

const metadata: Meta<typeof PasswordInput> = {
  component: PasswordInput,
  render: (args) => (
    <div style={{ width: 240 }}>
      <PasswordInput {...args} />
    </div>
  ),
};

export default metadata;

export const Basic = {
  args: {
    placeholder: "Enter your password",
  },
};
