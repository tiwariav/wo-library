import { Meta, StoryObj } from "@storybook/react";
import {
  IconCircleChevronDown,
  IconCircleChevronRight,
} from "@tabler/icons-react";

import WoSwiper, { WO_SWIPER_VARIANTS, WoSwiperProps } from "./WoSwiper.js";

const moreLinkMap = {
  ArrowHorizontal: <IconCircleChevronRight />,
  ArrowVertical: <IconCircleChevronDown />,
  None: null,
  SeeMore: <button>See more</button>,
};

function Template(args: WoSwiperProps) {
  return (
    <div style={{ overflow: "hidden", padding: 4 }}>
      <WoSwiper {...args}>
        {Array.from({ length: 11 }, (_, index) => (
          <div className="story-card" key={index} style={{ maxWidth: 200 }}>
            Content ...
          </div>
        ))}
      </WoSwiper>
    </div>
  );
}

const metadata: Meta<typeof WoSwiper> = {
  argTypes: {
    moreLink: { mapping: moreLinkMap, options: Object.keys(moreLinkMap) },
    moreLinkVertical: {
      mapping: moreLinkMap,
      options: Object.keys(moreLinkMap),
    },
  },
  component: WoSwiper,
  render: (args) => <Template {...args} />,
};

export default metadata;

type Story = StoryObj<typeof WoSwiper>;

export const Basic: Story = {
  args: {
    slidesPerView: "auto",
    subtitle: "Horizontally scrollable elements",
    title: "A swiper section",
  },
};

export const Single: Story = {
  args: {
    slidesPerView: 1,
    subtitle: Basic.args?.subtitle,
    title: "A swiper section",
  },
};

export const Variants: Story = {
  args: {
    slidesPerView: 3,
    subtitle: Basic.args?.subtitle,
  },
  render: ({ title, ...args }) => (
    <div className="story-list">
      {WO_SWIPER_VARIANTS.map((variant) => (
        <Template
          key={variant}
          title={title ?? `A '${variant}' swiper section`}
          variant={variant}
          {...args}
        />
      ))}
    </div>
  ),
};

export const WithLinks: Story = {
  args: {
    ...Basic.args,
    moreLink: "SeeMore",
    moreLinkVertical: "ArrowVertical",
  },
};

export const WithSeparator: Story = {
  args: {
    ...Basic.args,
    hasSeparator: true,
    moreLink: "SeeMore",
    moreLinkVertical: "ArrowVertical",
  },
};

export const Pagination: Story = {
  args: {
    ...Basic.args,
    pagination: true,
  },
};

export const NoNavigation: Story = {
  args: {
    ...Basic.args,
    navigation: false,
  },
};
