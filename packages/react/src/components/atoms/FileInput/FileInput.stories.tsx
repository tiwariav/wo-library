import type { Meta, StoryObj } from "@storybook/react";

import { useState } from "react";

import type { FileInputProps } from "./FileInput.js";

import UploadFile from "../../../tools/uploadFile.js";
import FileInput from "./FileInput.js";

function Template({ files, ...args }: FileInputProps) {
  const [allFiles, setFiles] = useState(files);
  return (
    <FileInput
      files={allFiles}
      updateFiles={(newFiles) => {
        setFiles(
          newFiles.map((item) =>
            item instanceof UploadFile ? item : new UploadFile(item),
          ),
        );
      }}
      {...args}
    />
  );
}

const metadata: Meta<FileInputProps> = {
  component: FileInput,
  render: (args) => <Template {...args} />,
};

export default metadata;

type Story = StoryObj<typeof FileInput>;

export const Basic: Story = {};

class CustomUploadFile extends UploadFile {
  text?: string;
}

function FileObjectTemplate({ files, ...args }: FileInputProps) {
  const [allFiles, setFiles] = useState<CustomUploadFile[] | undefined>(files);
  return (
    <>
      <FileInput
        files={allFiles}
        updateFiles={(newFiles) => {
          setFiles(
            newFiles.map((item) => {
              if (item instanceof CustomUploadFile) {
                return item;
              }
              const customFile = new CustomUploadFile(item);
              customFile.text = `custom text from file ${customFile.file.name}`;
              return customFile;
            }),
          );
        }}
        {...args}
      />
      <div>{allFiles?.map((file) => file.text ?? "")}</div>
    </>
  );
}

export const CustomFileObject: Story = {
  render: (args) => <FileObjectTemplate {...args} />,
};

function PasswordTemplate({ files, ...args }: FileInputProps) {
  const [allFiles, setFiles] = useState(files);
  return (
    <div className="story-bg-container">
      <FileInput
        files={allFiles}
        updateFiles={(newFiles) => {
          setFiles(
            newFiles.map((item) => {
              if (!(item instanceof File)) {
                return item;
              }
              const file = new UploadFile(item);
              file.data = [
                {
                  name: "password",
                  props: {
                    label: "Password",
                    variant: "outlined",
                  },
                  type: "password",
                },
              ];
              return file;
            }),
          );
        }}
        {...args}
      />
    </div>
  );
}

export const WithPassword: Story = {
  render: (args) => <PasswordTemplate {...args} />,
};
