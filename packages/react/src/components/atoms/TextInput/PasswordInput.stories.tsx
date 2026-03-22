import type { Meta } from "@storybook/react";

import PasswordInput from "./PasswordInput.js";

const metadata: Meta<typeof PasswordInput> = {
  component: PasswordInput,
  parameters: {
    docs: {
      description: {
        component:
          "Password field extending TextInput with a built-in show/hide toggle button.",
      },
    },
  },
  render: (args) => (
    <div style={{ width: 240 }}>
      <PasswordInput {...args} />
    </div>
  ),
  title: "Atoms/PasswordInput",
};

export default metadata;

export const Basic = {
  args: {
    placeholder: "Enter your password",
  },
};
