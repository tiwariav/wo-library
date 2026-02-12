import type { Meta, StoryObj } from "@storybook/react";

import type { CardProps } from "../../atoms/Card/Card.js";
import type { CollectionProps } from "./index.js";

import {
  Basic as ImageBasic,
  Template as ImageTemplate,
} from "../../atoms/Image/Image.stories.js";
import { Card } from "../../atoms/index.js";
import Collection from "./index.js";

type TemplateProps = {
  cardWidth?: number;
  variant?: "grid" | "list";
} & Omit<CollectionProps, "children">;

export function Template({ cardWidth, variant, ...args }: TemplateProps) {
  const itemArgs: Partial<CardProps> = {
    style: { width: cardWidth },
  };
  if (variant !== "grid") {
    itemArgs.layout = "horizontal";
  }
  return (
    <Collection {...args} variant={variant}>
      {Array.from({ length: 32 }, (_, index) => (
        <Card
          image={<ImageTemplate {...ImageBasic.args} />}
          key={index}
          {...itemArgs}
        >
          Expedita possimus dolor est unde possimus. Velit est qui alias
          veritatis a reprehenderit. Eos minus velit dolorem dolorem voluptatem
          molestiae odio et dolor.
        </Card>
      ))}
    </Collection>
  );
}

const metadata: Meta<typeof Collection> = {
  component: Collection,
  excludeStories: /.*Template$/,
  render: Template,
};

export default metadata;

type Story = StoryObj<typeof Collection>;

export const Basic: Story = {
  args: {
    filter: [
      {
        key: "release_date",
        name: "Release Date",
        options: ["this week", "this month", "this year"],
      },
      {
        key: "language",
        name: "Language",
        options: ["English"],
      },
    ],
    sort: [
      { key: "release_date", name: "Release Date" },
      { key: "popularity", name: "Popularity" },
    ],
    title: "A list of items",
  },
};

export const FixedColumns: Story = {
  args: {
    ...Basic.args,
    columns: 2,
    title: "A list of items, with fixed number of columns",
  },
};

export const Grid: Story = {
  args: {
    ...Basic.args,
    title: "A grid of items",
    variant: "grid" as const,
  },
};
