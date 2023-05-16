import Tooltip from "./Tooltip.js";

const metadata = {
  component: Tooltip,
};
export default metadata;

const Template = ({ ...args }) => {
  return (
    <Tooltip title={"In Tooltip"} style={{ display: "inline-block" }} {...args}>
      Click Me
    </Tooltip>
  );
};

export const Basic = {
  render: (args) => <Template {...args} />,
};
