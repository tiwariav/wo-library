import type { Meta, StoryObj } from "@storybook/react";

import FormError from "./FormError.js";

const metadata: Meta<typeof FormError> = {
  component: FormError,
  parameters: {
    docs: {
      description: {
        component:
          "Displays validation error messages from `react-hook-form`. Accepts a `messages` map or string and renders each error as a paragraph.",
      },
    },
  },
  title: "Atoms/FormError",
};

export default metadata;

type Story = StoryObj<typeof FormError>;

export const SingleError: Story = {
  args: {
    messages: { required: "This field is required" },
  },
};

export const MultipleErrors: Story = {
  args: {
    messages: {
      maxLength: "Maximum 100 characters allowed",
      minLength: "Minimum 3 characters required",
      required: "This field is required",
    },
  },
};

export const NoErrors: Story = {
  args: {
    messages: undefined,
  },
};
