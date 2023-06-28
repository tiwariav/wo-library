import Tooltip from "./Tooltip.js";

const metadata = {
  component: Tooltip,
};
export default metadata;

const Template = ({ ...args }) => {
  return (
    <Tooltip style={{ display: "inline-block" }} title="In Tooltip" {...args}>
      Click Me
    </Tooltip>
  );
};

export const Basic = {
  render: (args) => <Template {...args} />,
};
