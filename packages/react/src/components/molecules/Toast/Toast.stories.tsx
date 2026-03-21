import type { Meta, StoryObj } from "@storybook/react";

import { ToastContainer, useToastMethods } from "./Toast.js";

const meta: Meta<typeof ToastContainer> = {
  component: ToastContainer,
  parameters: {
    docs: {
      description: {
        component: "Container for Toast notifications. Use with `ToastProvider`.",
      },
    },
  },
  title: "Molecules/Toast",
};

export default meta;
type Story = StoryObj<typeof ToastContainer>;

export const Default: Story = {
  render: () => {
    const { dispatch } = useToastMethods();
    return (
      <div>
        <button
          onClick={() =>
            dispatch.addToast({ message: "Success message!", type: "success" })
          }
          type="button"
        >
          Add Success Toast
        </button>
        <button
          onClick={() =>
            dispatch.addToast({ message: "Error message!", type: "error" })
          }
          type="button"
        >
          Add Error Toast
        </button>
        <ToastContainer />
      </div>
    );
  },
};
