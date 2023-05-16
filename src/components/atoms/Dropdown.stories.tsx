import Dropdown from "./Dropdown.js";

const metadata = {
  component: Dropdown,
};
export default metadata;

const Template = ({ ...args }) => {
  return (
    <Dropdown label="In Dropdown" {...args}>
      Click Me
    </Dropdown>
  );
};

export const Basic = {
  render: (args) => <Template {...args} />,
};
