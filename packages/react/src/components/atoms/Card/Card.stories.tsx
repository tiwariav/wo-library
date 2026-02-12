import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";

import type { CardProps } from "./Card.js";

import { COMPONENT_FLOAT } from "../../../tools/constants/props.js";
import {
  Basic as ImageBasic,
  Template as ImageTemplate,
} from "../Image/Image.stories.js";
import Card, {
  CARD_FLYING,
  CARD_HEIGHTS,
  CARD_LAYOUTS,
  CARD_VARIANTS,
  CARD_VIEW_MODES,
} from "./Card.js";

const imageMap = {
  ImageBasic: <ImageTemplate {...ImageBasic.args} />,
  None: null,
};

type TemplateProps = { width?: number } & CardProps;

export function Template({ width, ...args }: TemplateProps) {
  return <Card style={{ width }} {...args} />;
}

const metadata: Meta<TemplateProps> = {
  args: {
    children: "Card content",
  },
  argTypes: {
    image: { mapping: imageMap, options: Object.keys(imageMap) },
    width: { control: { max: 320, min: 80, type: "range" } },
  },
  component: Card,
  excludeStories: /.*Template$/,
  render: Template,
};

export default metadata;

type Story = StoryObj<typeof Card>;

export const Basic: Story = {};

export const WithImage: Story = {
  args: {
    ...Basic.args,
    image: "ImageBasic",
  },
};

export const Layouts: Story = {
  args: {
    ...WithImage.args,
  },
  render: (args) => (
    <div className="story-grid">
      <Card {...args} />
      {CARD_LAYOUTS.map((layout) => (
        <Card key={layout} layout={layout} {...args} />
      ))}
    </div>
  ),
};

function FirstCardTemplate({
  children,
  firstContent,
  ...args
}: { firstContent: ReactNode } & CardProps) {
  return (
    <div className="story-grid">
      <Card {...args}>{firstContent}</Card>
      {children}
    </div>
  );
}

export const Floating: Story = {
  render: ({ children, ...args }) => (
    <FirstCardTemplate firstContent={children}>
      {COMPONENT_FLOAT.map((floating) => (
        <Card floating={floating} key={floating} {...args}>
          floating {floating}
        </Card>
      ))}
    </FirstCardTemplate>
  ),
};

export const Flying: Story = {
  render: ({ children, ...args }) => (
    <FirstCardTemplate firstContent={children}>
      {CARD_FLYING.map((floating) => (
        <Card flying={floating} key={floating} {...args}>
          flying {floating}
        </Card>
      ))}
    </FirstCardTemplate>
  ),
};

export const Height: Story = {
  render: ({ children, ...args }) => (
    <FirstCardTemplate firstContent={children}>
      {CARD_HEIGHTS.map((height) => (
        <Card height={height} key={height} {...args}>
          height {height}
        </Card>
      ))}
    </FirstCardTemplate>
  ),
};

export const Variants: Story = {
  ...WithImage,
  render: (...args) => (
    <div className="story-grid">
      {CARD_VARIANTS.map((variant) => (
        <Card key={variant} variant={variant} {...args}>
          variant {variant}
        </Card>
      ))}
    </div>
  ),
};

export const ViewMode: Story = {
  args: {
    image: "ImageBasic",
  },
  render: ({ children, ...args }) => (
    <FirstCardTemplate firstContent={children}>
      {CARD_VIEW_MODES.map((viewMode) => (
        <Card key={viewMode} viewMode={viewMode} {...args}>
          viewMode ${viewMode}
        </Card>
      ))}
    </FirstCardTemplate>
  ),
};

export const IsBusy: Story = {
  args: {
    ...Basic.args,
    isBusy: true,
  },
};
