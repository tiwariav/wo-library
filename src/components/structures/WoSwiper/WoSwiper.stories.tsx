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

const render: Story["render"] = (args) => {
  return (
    <div style={{ overflow: "hidden", padding: 4 }}>
      <WoSwiper {...args}>
        {Array.from({ length: 11 }).map((_, index) => (
          <div className="story-card" key={index} style={{ maxWidth: 200 }}>
            Content ...
          </div>
        ))}
      </WoSwiper>
    </div>
  );
};

export const Basic: Story = {
  args: {
    slidesPerView: "auto",
    subtitle: "Horizontally scrollable elements",
    title: "A swiper section",
  },
  render,
};
export const Single: Story = {
  args: {
    slidesPerView: 1,
    subtitle: "Horizontally scrollable elements",
    title: "A swiper section",
  },
  render,
};

export const Coverflow: Story = {
  args: {
    ...Basic.args,
    slidesPerView: 3,
    variant: "coverflow",
  },
  render,
};

export const WithLinks: Story = {
  args: {
    ...Basic.args,
    moreLink: "SeeMore",
    moreLinkVertical: "ArrowVertical",
  },
  render,
};

export const WithSeparator: Story = {
  args: {
    ...Basic.args,
    hasSeparator: true,
    moreLink: "SeeMore",
    moreLinkVertical: "ArrowVertical",
  },
  render,
};
