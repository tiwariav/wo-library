import type { Meta, StoryObj } from "@storybook/react";

import Lorem from "./Lorem.js";

const metadata: Meta<typeof Lorem> = {
  component: Lorem,
  parameters: {
    docs: {
      description: {
        component:
          "Generates Lorem Ipsum placeholder text using the `lorem-ipsum` library. Supports HTML and plain text formats.",
      },
    },
  },
  title: "Atoms/Lorem",
};

export default metadata;

type Story = StoryObj<typeof Lorem>;

export const Default: Story = {
  args: {},
};

export const MultipleParagraphs: Story = {
  args: {
    count: 3,
    units: "paragraphs",
  },
};

export const SingleSentence: Story = {
  args: {
    count: 1,
    units: "sentences",
  },
};

export const PlainText: Story = {
  args: {
    count: 2,
    format: "plain",
    units: "paragraphs",
  },
};
