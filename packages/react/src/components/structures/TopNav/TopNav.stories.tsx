import type { Meta, StoryObj } from "@storybook/react";

import {
  IconDogBowl,
  IconLogin,
  IconMicrophone,
  IconSearch,
} from "@tabler/icons-react";
import clsx from "clsx";
import { useRef } from "react";
import { randomGradientGenerator } from "wo-library/tools/colors.js";

import type { TopNavProps } from "./TopNav.js";

import Lorem from "../../../vendors/Lorem.js";
import { Button, TextInput } from "../../atoms/index.js";
import TopNav from "./TopNav.js";
import TopNavItem from "./TopNavItem.js";
import { TOPNAV_VARIANTS } from "./utils.js";

const iconMap = { DogBowl: <IconDogBowl /> };
const itemsMap = {
  Button: (
    <TopNavItem key={1}>
      <Button size="small" variant="outlined">
        Button
      </Button>
    </TopNavItem>
  ),
  ButtonWithIcon: (
    <TopNavItem key={2}>
      <Button iconBefore={<IconLogin />} variant="outlined">
        Button
      </Button>
    </TopNavItem>
  ),
  ButtonWithSeparator: (
    <TopNavItem hasSeparator key={3}>
      <Button iconBefore={<IconMicrophone />} variant="outlined">
        Button
      </Button>
    </TopNavItem>
  ),
  SearchInput: (
    <TopNavItem key={4}>
      <TextInput
        iconBefore={<IconSearch />}
        placeholder="Search Here"
        style={{ minWidth: 240 }}
      />
    </TopNavItem>
  ),
};

function Template({ className, ...props }: TopNavProps) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      className={clsx("story-height-scroll", className)}
      ref={ref}
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      style={{ backgroundImage: randomGradientGenerator(20) }}
    >
      <TopNav containerRef={ref} {...props} />
      <div className="story-box story-height-overflow">
        <Lorem count={4} units="paragraphs" />
      </div>
    </div>
  );
}

const metadata: Meta<typeof TopNav> = {
  args: {
    contentLeft: [itemsMap.SearchInput],
    contentRight: [itemsMap.ButtonWithSeparator, itemsMap.Button],
    logo: iconMap.DogBowl,
  },
  argTypes: {
    contentLeft: {
      control: {
        mapping: itemsMap,
        options: Object.keys(itemsMap),
        type: "inline-check",
      },
    },
    contentRight: {
      control: { options: Object.keys(itemsMap), type: "inline-check" },
    },
    logo: {
      control: {
        mapping: iconMap,
        options: Object.keys(iconMap),
      },
    },
  },
  component: TopNav,
  render: Template,
};

export default metadata;

type Story = StoryObj<typeof TopNav>;

export const Basic: Story = {};

export const Sticky: Story = {
  args: { banner: <div>What a great day!</div> },
  render: (args) => (
    <div className="story-grid">
      <Template {...args} className="story-grid-row" logo="fixed" sticky />
      <Template {...args} logo="hideOnScroll" sticky={{ hideOnScroll: true }} />
      <Template {...args} logo="shrinkOffset" sticky={{ shrinkOffset: 100 }} />
    </div>
  ),
};

export const Variants: Story = {
  args: { sticky: true },
  render: (args) => (
    <div className="story-grid">
      {TOPNAV_VARIANTS.map((variant) => (
        <Template key={variant} variant={variant} {...args} logo={variant} />
      ))}
    </div>
  ),
};

export const MultiRow: Story = {
  args: {
    multiRow: true,
    variant: "transparent",
  },
};

export const WithBanner: Story = {
  args: {
    banner: <div>What a great day!</div>,
  },
};

export const HangingLogo: Story = {
  args: {
    logoVariant: "hanging",
  },
};

export const MiddleContent: Story = {
  args: {
    contentLeft: (
      <>
        <div>Left</div>
        <div>Left</div>
      </>
    ),
    contentMiddle: (
      <>
        <div>Middle</div>
        <div>Middle</div>
      </>
    ),
    contentRight: (
      <>
        <div>Right</div>
        <div>Right</div>
      </>
    ),
    logo: iconMap.DogBowl,
    sticky: { hideOnScroll: true, shrinkOffset: 100 },
    variant: "flat",
  },
};
