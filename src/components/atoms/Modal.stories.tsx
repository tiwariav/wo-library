import { Meta, StoryObj } from "@storybook/react";
import { ReactNode, useState } from "react";

import { playFloatingBasic } from "../../tools/storybook/play.js";
import Modal, { ModalProps } from "./Modal.js";

const Template = ({
  initiallyOpen,
  modalContent = "",
  onClose,
  ...args
}: ModalProps & { initiallyOpen?: boolean; modalContent?: ReactNode }) => {
  const [open, setOpen] = useState<boolean>(!!initiallyOpen);
  console.log(open);
  return (
    <div>
      <button id="showButton" onClick={() => setOpen(true)}>
        Show Modal
      </button>
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          onClose?.();
        }}
        {...args}
      >
        <div className="story-box">{modalContent || MODAL_TEXT}</div>
      </Modal>
    </div>
  );
};

const metadata: Meta<typeof Modal> = {
  component: Modal,
  parameters: {
    docs: { story: { inline: false } },
  },
  render: (args) => <Template {...args} />,
};
export default metadata;

type Story = StoryObj<ModalProps & { modalContent: ReactNode }>;

const MODAL_TEXT = "Content inside Modal!";

export const Basic: Story = {
  play: async ({ canvasElement }) => {
    await playFloatingBasic(canvasElement, MODAL_TEXT);
  },
};

export const Open: Story = {
  args: {
    isOpen: true,
  },
};

export const OnClose: Story = {
  args: {
    onClose: () => alert("Modal closed!"),
  },
};

export const MaxWidth: Story = {
  args: {
    modalContent: (
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro dolorum
        numquam id voluptatum labore, veniam, aspernatur accusamus maxime odio
        hic sed est dicta voluptatibus nisi. Dolor temporibus facere omnis
        culpa. Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Accusamus, officia? Sequi, corporis repellat, tenetur itaque eius
        accusamus explicabo ex laboriosam dolore, nam dicta debitis maxime
        excepturi! Sequi commodi quis cumque obcaecati. Rerum molestias saepe
        quia minima earum quis cumque error expedita aliquid quod optio repellat
        voluptate voluptatibus officia, eligendi tempora neque illo sit hic
        ullam deleniti in vel consequuntur. Hic veniam nihil sed esse. Officiis
        saepe veniam dicta quaerat quam quasi omnis illum. Mollitia doloribus,
        voluptas tempora numquam doloremque voluptatem deleniti blanditiis nisi
        ad, velit ipsum modi cupiditate. In sint, unde delectus, laudantium
        tenetur placeat tempora provident officia pariatur sapiente fuga tempore
        quia odit, deserunt porro illum voluptatibus facere quam. Eum iste porro
        harum rerum magnam. Vero magnam laborum accusantium nisi, nihil
        exercitationem quas dolorum nostrum, sunt nobis neque aperiam, numquam
        repellendus unde accusamus rem dolore alias minima eos impedit odit
        quisquam quod. Necessitatibus, distinctio quisquam tempora enim rem nam
        optio nostrum quae ipsum corporis, earum aperiam, nemo a ex magnam modi
        praesentium excepturi hic dicta inventore id consequatur totam nesciunt.
        Perspiciatis corporis alias, odit officiis nostrum rem fugiat, excepturi
        autem animi quos cumque ipsa ullam, eos illo. Officia ab harum quis
        nulla pariatur neque optio? Modi culpa sed ipsam?
        <input placeholder="Placeholder" />
      </div>
    ),
  },
};
