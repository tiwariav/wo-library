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

type MoreLinkOptions = keyof typeof moreLinkMap;

const metadata = {
  argTypes: {
    moreLink: {
      control: { options: Object.keys(moreLinkMap), type: "select" },
    },
  },
  component: WoSwiper,
};

export default metadata;

const Template = ({
  moreLink,
  moreLinkVertical,
  ...args
}: {
  moreLink: MoreLinkOptions;
  moreLinkVertical: MoreLinkOptions;
}) => {
  return (
    <WoSwiper
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      moreLink={moreLinkMap[moreLink]}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      moreLinkVertical={moreLinkMap[moreLinkVertical]}
      {...args}
    >
      {/* {Array.from({ length: 11 }).map((_, index) => ( */}
      <p>Content ...</p>
      {/* ))} */}
    </WoSwiper>
  );
};

export const Basic = {
  args: {
    subtitle: "Horizontally scrollable elements",
    title: "A swiper section",
  },
  render: (args) => <Template {...args} />,
};

export const Coverflow = {
  args: {
    ...Basic.args,
    variant: "coverflow",
  },
  render: (args) => <Template {...args} />,
};

export const WithLinks = {
  args: {
    ...Basic.args,
    moreLink: "SeeMore",
    moreLinkVertical: "ArrowVertical",
  },
  render: (args) => <Template {...args} />,
};

export const WithSeparator = {
  args: {
    ...Basic.args,
    hasSeparator: true,
    moreLink: "SeeMore",
    moreLinkVertical: "ArrowVertical",
  },
  render: (args) => <Template {...args} />,
};
