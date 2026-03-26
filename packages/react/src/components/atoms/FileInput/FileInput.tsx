import type { ChangeEvent, ComponentPropsWithoutRef, ReactNode } from "react";

import { IconReload, IconTrashXFilled } from "@tabler/icons-react";
import { clsx } from "clsx";
import { debounce } from "lodash-es";
import { useId, useState } from "react";

import type UploadFile from "../../../tools/uploadFile.js";

import { INPUT_DEBOUNCE } from "@wo-library/js";
import { getDynamicClassName } from "../../../tools/utils.js";
import { FormIconSpan } from "../../../wrappers/span.js";
import Button from "../Button/Button.js";
import CircleProgress from "../CircleProgress/CircleProgress.js";
import InputWrapper from "../InputWrapper.js";
import Spinner from "../Spinner/Spinner.js";
import PasswordInput from "../TextInput/PasswordInput.js";
import * as styles from "./fileInput.module.css";

export const FILE_INPUT_VARIANTS = ["outlined"] as const;

/**
 * Props for the {@link FileInput} component.
 * @template TFile - Custom file type extending {@link UploadFile} (default: `UploadFile`).
 */
export interface FileInputProps<
  TFile extends UploadFile = UploadFile,
> extends Omit<Readonly<ComponentPropsWithoutRef<"input">>, "size"> {
  /** Currently attached files displayed as a list below the input. */
  files?: TFile[];
  /** Icon rendered after the placeholder text. */
  iconAfter?: ReactNode;
  /** Icon rendered before the placeholder text. */
  iconBefore?: ReactNode;
  innerClassNames?: {
    input?: string;
    label?: string;
    listItemDataInput?: string;
    placeholder?: string;
  };
  /** Shows a spinner overlay while keeping content visible (see `isBusy` vs `isLoading` pattern). */
  isBusy?: boolean;
  /** Label rendered above the file picker button. */
  label?: ReactNode;
  /** Placeholder text shown on the browse button. @default 'Browse' */
  placeholder?: string;
  /**
   * Callback invoked when files are added, removed, or updated.
   * Receives the updated file list and the action type.
   */
  updateFiles?: (
    files: (File | TFile)[],
    action: "add" | "remove" | "update",
  ) => Promise<void> | void;
  /** Visual variant for the file input button. */
  variant?: (typeof FILE_INPUT_VARIANTS)[number];
}

function FileStatus<TFile extends UploadFile>({
  item,
  updateFiles,
}: Readonly<{
  item: TFile;
  updateFiles: FileInputProps<TFile>["updateFiles"];
}>) {
  const renderActionButton = (action: "add" | "remove", icon: ReactNode) => {
    return (
      <div>
        <Button
          onClick={() => void updateFiles?.([item], action)}
          spacing="equal"
          variant="borderless"
        >
          {icon}
        </Button>
      </div>
    );
  };

  if (item.status === "uploading") {
    return (
      <>
        <div className={clsx(styles.listItemStatusText, styles.progress)}>
          Uploading...
        </div>
        {item.progress && (
          <div>
            <CircleProgress
              className={styles.listItemProgress}
              progress={item.progress}
              squareSize={18}
            />
          </div>
        )}
      </>
    );
  }
  if (item.status === "uploaded") {
    return (
      <>
        <div className={clsx(styles.listItemStatusText, styles.success)}>
          Uploaded
        </div>
        {renderActionButton("remove", <IconTrashXFilled />)}
      </>
    );
  }
  if (item.status === "failed") {
    return (
      <>
        <div className={clsx(styles.listItemStatusText, styles.failed)}>
          Failed
        </div>
        {renderActionButton("add", <IconReload />)}
        {renderActionButton("remove", <IconTrashXFilled />)}
      </>
    );
  }
  return null;
}

export default function FileInput<TFile extends UploadFile = UploadFile>({
  className,
  files,
  iconAfter,
  iconBefore,
  innerClassNames,
  isBusy,
  label,
  onBlur,
  onChange,
  onFocus,
  placeholder = "Browse",
  updateFiles,
  variant,
  ...props
}: Readonly<FileInputProps<TFile>>) {
  const [hasFocus, setHasFocus] = useState(false);
  const fileInputId = useId();

  const handleFocus: typeof onFocus = (event) => {
    setHasFocus(true);
    onFocus?.(event);
  };

  const handleBlur: typeof onBlur = (event) => {
    setHasFocus(false);
    onBlur?.(event);
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0 && updateFiles) {
      const selectedFiles: File[] = [];
      for (const selectedFile of event.target.files) {
        if (selectedFile instanceof File) {
          selectedFiles.push(selectedFile);
        }
      }
      await updateFiles(selectedFiles, "add");
    }
    onChange?.(event);
  };

  const handleDataChange = debounce(
    async (
      event: ChangeEvent<HTMLInputElement>,
      file: TFile,
      dataIndex: number,
    ) => {
      const fileData = file.data ? [...file.data] : [];
      fileData[dataIndex].value = event.target.value;
      // Object.assign to avoid spreading class instance
      const updatedFile = Object.assign(
        Object.create(Object.getPrototypeOf(file) as object) as object,
        file,
        { data: fileData },
      ) as TFile;
      await updateFiles?.([updatedFile], "update");
    },
    INPUT_DEBOUNCE,
  );

  return (
    <div className={clsx(className)}>
      <InputWrapper
        as="label"
        className={clsx(
          styles.wrapper,
          variant && getDynamicClassName(styles, `is-${variant}`),
          {
            [styles.hasFocus]: hasFocus,
          },
        )}
      >
        {!!label && <span className={styles.label}>{label}</span>}
        {!!iconBefore && (
          <span className={clsx(styles.iconWrapper)}>
            <FormIconSpan>{iconBefore}</FormIconSpan>
          </span>
        )}
        <input
          className={clsx(styles.input)}
          id={fileInputId}
          onBlur={handleBlur}
          onChange={(event) => void handleChange(event)}
          onFocus={handleFocus}
          type="file"
          {...props}
        />
        <span
          className={clsx(styles.placeholder, innerClassNames?.placeholder)}
        >
          {placeholder}
        </span>
        {!!iconAfter && (
          <span className={clsx(styles.iconWrapper, styles.iconRight)}>
            <FormIconSpan>{iconAfter}</FormIconSpan>
          </span>
        )}
        {isBusy && <Spinner className={styles.spinner} />}
      </InputWrapper>
      {files && files.length > 0 && (
        <div>
          {files.map((item, index) => (
            <div key={index}>
              <div className={styles.listItem} key={index}>
                <div className={styles.listItemText}>{item.file.name}</div>
                <div className={styles.uploadSection}>
                  <FileStatus item={item} updateFiles={updateFiles} />
                </div>
              </div>
              {item.data &&
                item.data.length > 0 &&
                item.data.map((dataItem, dataIndex) =>
                  dataItem.type === "password" ? (
                    <PasswordInput
                      defaultValue={dataItem.value}
                      innerClassNames={{
                        input: styles.listItemDataInput,
                        label: styles.listItemDataLabel,
                      }}
                      key={dataIndex}
                      onChange={(event) =>
                        void handleDataChange(event, item, dataIndex)
                      }
                      size="small"
                      {...dataItem.props}
                    />
                  ) : (
                    <img
                      alt={dataItem.name}
                      className={styles.previewImage}
                      id={dataItem.resource}
                      key={dataIndex}
                      src={dataItem.resource}
                    />
                  ),
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
