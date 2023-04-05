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
    moreLink: {
      control: { options: Object.keys(moreLinkMap), type: "select" },
    },
  },
  component: WoSwiper,
};

export default metadata;

const Template = ({ moreLink, moreLinkVertical, cardWidth, ...args }) => {
  return (
    <WoSwiper
      moreLink={moreLinkMap[moreLink]}
      moreLinkVertical={moreLinkMap[moreLinkVertical]}
      {...args}
    >
      {Array.from<JSX.Element>({ length: 11 }).fill(<p>Content...</p>)}
    </WoSwiper>
  );
};

export const Basic = {
  args: {
    cardWidth: 160,
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
