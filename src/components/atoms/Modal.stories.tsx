import { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";

import { playFloatingBasic } from "../../tools/storybook/play.js";
import Modal from "./Modal.js";

const metadata: Meta<typeof Modal> = {
  component: Modal,
  parameters: {
    docs: { story: { inline: false } },
  },
};
export default metadata;

type Story = StoryObj<typeof Modal>;

const MODAL_TEXT = "Content inside Modal!";

const Template = ({ isOpen = false, modalContent = "", ...args }) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <div>
      <button id="showButton" onClick={() => setOpen(true)}>
        Show Modal
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} {...args}>
        <div className="story-box">{modalContent || MODAL_TEXT}</div>
      </Modal>
    </div>
  );
};

const MaxWidthTemplate = ({ isOpen = false, ...args }) => {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <div>
      <button id="showButton" onClick={() => setOpen(true)}>
        Show Modal
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} {...args}>
        <div className="story-box">
          <div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro
            dolorum numquam id voluptatum labore, veniam, aspernatur accusamus
            maxime odio hic sed est dicta voluptatibus nisi. Dolor temporibus
            facere omnis culpa. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Accusamus, officia? Sequi, corporis repellat,
            tenetur itaque eius accusamus explicabo ex laboriosam dolore, nam
            dicta debitis maxime excepturi! Sequi commodi quis cumque obcaecati.
            Rerum molestias saepe quia minima earum quis cumque error expedita
            aliquid quod optio repellat voluptate voluptatibus officia, eligendi
            tempora neque illo sit hic ullam deleniti in vel consequuntur. Hic
            veniam nihil sed esse. Officiis saepe veniam dicta quaerat quam
            quasi omnis illum. Mollitia doloribus, voluptas tempora numquam
            doloremque voluptatem deleniti blanditiis nisi ad, velit ipsum modi
            cupiditate. In sint, unde delectus, laudantium tenetur placeat
            tempora provident officia pariatur sapiente fuga tempore quia odit,
            deserunt porro illum voluptatibus facere quam. Eum iste porro harum
            rerum magnam. Vero magnam laborum accusantium nisi, nihil
            exercitationem quas dolorum nostrum, sunt nobis neque aperiam,
            numquam repellendus unde accusamus rem dolore alias minima eos
            impedit odit quisquam quod. Necessitatibus, distinctio quisquam
            tempora enim rem nam optio nostrum quae ipsum corporis, earum
            aperiam, nemo a ex magnam modi praesentium excepturi hic dicta
            inventore id consequatur totam nesciunt. Perspiciatis corporis
            alias, odit officiis nostrum rem fugiat, excepturi autem animi quos
            cumque ipsa ullam, eos illo. Officia ab harum quis nulla pariatur
            neque optio? Modi culpa sed ipsam?
            <input placeholder="Placeholder" />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const Basic: Story = {
  play: async ({ canvasElement }) => {
    await playFloatingBasic(canvasElement, MODAL_TEXT);
  },

  render: (args) => <Template {...args} />,
};

export const Open: Story = {
  args: {
    isOpen: true,
  },
  render: Basic.render,
};

export const OnClose: Story = {
  args: {
    onClose: () => alert("Modal closed!"),
  },
  render: Basic.render,
};

export const MaxWidth: Story = {
  render: (args) => <MaxWidthTemplate {...args} />,
};
