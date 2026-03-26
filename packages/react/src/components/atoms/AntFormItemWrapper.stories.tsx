import type { Meta, StoryObj } from "@storybook/react";

import AntFormItemWrapper from "./AntFormItemWrapper.js";

const metadata: Meta<typeof AntFormItemWrapper> = {
  component: AntFormItemWrapper,
  parameters: {
    docs: {
      description: {
        component:
          "Ant Design Form.Item wrapper with focus/value state management, loading overlays, and keyboard event handling. Extends `FormItemProps` from antd.",
      },
    },
  },
  title: "Atoms/AntFormItemWrapper",
};

export default metadata;

type Story = StoryObj<typeof AntFormItemWrapper>;

export const Default: Story = {
  args: {
    children: <input placeholder="Enter value" />,
    label: "Field Label",
  },
};

export const WithLoading: Story = {
  args: {
    children: <input placeholder="Loading..." />,
    label: "Loading Field",
    loading: true,
  },
};

export const Required: Story = {
  args: {
    children: <input placeholder="Required field" />,
    label: "Required Field",
    required: true,
  },
};
