import { StoryObj } from "@storybook/react";
import {
  IconCircleChevronDown,
  IconCircleChevronRight,
} from "@tabler/icons-react";

import WoSwiper from "./WoSwiper.js";

const moreLinkMap = {
  ArrowHorizontal: <IconCircleChevronRight />,
  ArrowVertical: <IconCircleChevronDown />,
  None: null,
  SeeMore: <button>See more</button>,
};

const metadata = {
  argTypes: {
    moreLink: { mapping: moreLinkMap, options: Object.keys(moreLinkMap) },
    moreLinkVertical: {
      mapping: moreLinkMap,
      options: Object.keys(moreLinkMap),
    },
  },
  component: WoSwiper,
};

export default metadata;

type Story = StoryObj<typeof WoSwiper>;

const Template: Story["render"] = (args) => {
  return (
    <WoSwiper {...args}>
      {Array.from({ length: 11 }).map((_, index) => (
        <p>Content ...</p>
      ))}
    </WoSwiper>
  );
};

export const Basic: Story = {
  args: {
    subtitle: "Horizontally scrollable elements",
    title: "A swiper section",
  },
  render: Template,
};

export const Coverflow: Story = {
  args: {
    ...Basic.args,
    variant: "coverflow",
  },
  render: Template,
};

export const WithLinks: Story = {
  args: {
    ...Basic.args,
    moreLink: "SeeMore",
    moreLinkVertical: "ArrowVertical",
  },
  render: Template,
};

export const WithSeparator: Story = {
  args: {
    ...Basic.args,
    hasSeparator: true,
    moreLink: "SeeMore",
    moreLinkVertical: "ArrowVertical",
  },
  render: Template,
};
