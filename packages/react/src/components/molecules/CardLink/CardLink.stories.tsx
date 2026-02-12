import type { Meta, StoryObj } from "@storybook/react";

import { useRef } from "react";

import { Anchor } from "../../atoms/index.js";
import CardLink, { type CardLinkProps } from "./CardLink.js";

const metadata: Meta<typeof CardLink> = {
  component: CardLink,
};

export default metadata;

type Story = StoryObj<typeof CardLink>;

function Template(args: Omit<CardLinkProps, "linkRef">) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  return (
    <div style={{ width: 240 }}>
      <CardLink linkRef={linkRef} {...args}>
        <Anchor href="#nowhere" ref={linkRef}>
          Main Link
        </Anchor>
        <div>Some more content</div>
      </CardLink>
    </div>
  );
}

export const Basic: Story = {
  render: (args) => <Template {...args} />,
};
