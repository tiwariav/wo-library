import { AiOutlineDown, AiOutlineRight } from "react-icons/ai";
import WoSwiper from "./WoSwiper.js";

const moreLinkMap = {
  ArrowHorizontal: <AiOutlineRight />,
  ArrowVertical: <AiOutlineDown />,
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

export const Basic = Template.bind({});
Basic.args = {
  cardWidth: 160,
  subtitle: "Horizontally scrollable elements",
  title: "A swiper section",
};

export const Coverflow = Template.bind({});
Coverflow.args = {
  ...Basic.args,
  variant: "coverflow",
};

export const WithLinks = Template.bind({});
WithLinks.args = {
  ...Basic.args,
  moreLink: "SeeMore",
  moreLinkVertical: "ArrowVertical",
};

export const WithSeparator = Template.bind({});
WithSeparator.args = {
  ...Basic.args,
  hasSeparator: true,
  moreLink: "SeeMore",
  moreLinkVertical: "ArrowVertical",
};
