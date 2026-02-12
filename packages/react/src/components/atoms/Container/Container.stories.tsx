import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";

import Container, {
  CONTAINER_HEIGHTS,
  CONTAINER_SPACINGS,
  CONTAINER_WIDTHS,
  type ContainerProps,
} from "./Container.js";

const metadata: Meta<typeof Container> = {
  args: {
    children: "This is a container. It provides space around content.",
  },
  component: Container,
  render: (args) => <Container className="story-bordered" {...args} />,
};

export default metadata;

type Story = StoryObj<typeof Container>;

export const Basic: Story = {};

export const Align: Story = {
  render: (args) => (
    <div className="story-grid">
      <Container className="story-bordered" {...args}>
        No align
      </Container>
      <Container align="center" className="story-bordered" {...args}>
        &apos;center&apos; align
      </Container>
    </div>
  ),
};

function FirstContainerTemplate({
  children,
  firstContent,
  isList,
  ...args
}: { firstContent: ReactNode; isList?: boolean } & ContainerProps) {
  return (
    <div className={isList ? "story-list" : "story-grid"}>
      <Container className="story-bordered" {...args}>
        {firstContent}
      </Container>
      {children}
    </div>
  );
}

export const Height: Story = {
  render: ({ children, ...args }) => (
    <FirstContainerTemplate firstContent={children} {...args}>
      {CONTAINER_HEIGHTS.map((height) => (
        <Container
          className="story-bordered"
          height={height}
          key={height}
          {...args}
        >
          <p>&apos;{height}&apos; height</p>
          {Array.from({ length: 10 }).map((_item, index) => (
            <p key={index}>{metadata.args?.children}</p>
          ))}
        </Container>
      ))}
    </FirstContainerTemplate>
  ),
};

export const Spacings: Story = {
  render: ({ children, ...args }) => (
    <FirstContainerTemplate firstContent={children} {...args}>
      {CONTAINER_SPACINGS.map((spacing) => (
        <Container
          className="story-bordered"
          key={spacing}
          spacing={spacing}
          {...args}
        >
          <p>&apos;{spacing}&apos; spacing</p>
          <p>{metadata.args?.children}</p>
        </Container>
      ))}
    </FirstContainerTemplate>
  ),
};

export const Variants: Story = {
  render: ({ children, ...args }) => (
    <FirstContainerTemplate firstContent={children} {...args}>
      <Container className="story-bordered" variant="secondary" {...args}>
        <p>&apos;secondary&apos; variant</p>
        <p>{metadata.args?.children}</p>
      </Container>
    </FirstContainerTemplate>
  ),
};
export const Widths: Story = {
  render: ({ children, ...args }) => (
    <FirstContainerTemplate firstContent={children} isList {...args}>
      {CONTAINER_WIDTHS.map((width) => (
        <Container
          className="story-bordered"
          key={width}
          width={width}
          {...args}
        >
          <p>&apos;{width}&apos; width</p>
          <p>{metadata.args?.children}</p>
        </Container>
      ))}
    </FirstContainerTemplate>
  ),
};
