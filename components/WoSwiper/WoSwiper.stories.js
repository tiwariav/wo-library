import path from "node:path";
import { AiOutlineDown, AiOutlineRight } from "react-icons/ai";
import { Button } from "ye-ui/components/atoms/forms";
import { WithImage as CardWithImage } from "ye-ui/components/atoms/sections/Card/Card.stories";
import { getStoryName } from "../../utils/storybook";
import WoSwiper from "./WoSwiper";

const moreLinkMap = {
  None: null,
  SeeMore: (
    <Button
      label="See more"
      size="small"
      iconAfter={<AiOutlineRight />}
      variant="outlined"
    />
  ),
  ArrowHorizontal: <AiOutlineRight />,
  ArrowVertical: <AiOutlineDown />,
};

const metadata = {
  title: getStoryName(path.dirname(import.meta.url)),
  component: WoSwiper,
  argTypes: {
    moreLink: {
      control: { type: "select", options: Object.keys(moreLinkMap) },
    },
  },
};

export default metadata;

const Template = ({ moreLink, moreLinkVertical, cardWidth, ...args }) => {
  const itemArgs = { ...CardWithImage.args, style: { width: cardWidth } };
  return (
    <WoSwiper
      moreLink={moreLinkMap[moreLink]}
      moreLinkVertical={moreLinkMap[moreLinkVertical]}
      {...args}
    >
      {Array.from({ length: 11 }).fill(<CardWithImage {...itemArgs} />)}
    </WoSwiper>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  cardWidth: 160,
  title: "A swiper section",
  subtitle: "Horizontally scrollable elements",
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
  moreLink: "SeeMore",
  moreLinkVertical: "ArrowVertical",
  hasSeparator: true,
};
