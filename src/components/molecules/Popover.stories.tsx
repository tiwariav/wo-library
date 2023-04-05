import Popover from "./Popover.js";

const metadata = {
  component: Popover,
};
export default metadata;

const Template = ({ ...args }) => {
  return (
    <Popover
      content={
        <div style={{ background: "#eee", padding: 16 }}>In popover</div>
      }
      {...args}
    >
      Click Me
    </Popover>
  );
};

export const Basic = {
  render: (args) => <Template {...args} />,
};
