/* eslint css-modules/no-unused-class: [2, {camelCase: true, markAsUsed: ['is-outlined'] }] */

import type { ChangeEvent, ComponentPropsWithoutRef, ReactNode } from "react";

import { IconReload, IconTrashXFilled } from "@tabler/icons-react";
import { clsx } from "clsx";
import { debounce } from "lodash-es";
import { useId, useState } from "react";

import type UploadFile from "../../../tools/uploadFile.js";

import { INPUT_DEBOUNCE } from "../../../tools/constants/time.js";
import { getDynamicClassName } from "../../../tools/utils.js";
import { FormIconSpan } from "../../../wrappers/span.js";
import Button from "../Button/Button.js";
import CircleProgress from "../CircleProgress/CircleProgress.js";
import InputWrapper from "../InputWrapper.js";
import Spinner from "../Spinner/Spinner.js";
import PasswordInput from "../TextInput/PasswordInput.js";
import * as styles from "./fileInput.module.css";

const FILE_INPUT_VARIANTS = ["outlined"] as const;

export interface FileInputProps<TFile extends UploadFile = UploadFile>
  extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  files?: TFile[];
  iconAfter?: ReactNode;
  iconBefore?: ReactNode;
  innerClassNames?: {
    input?: string;
    label?: string;
    listItemDataInput?: string;
    placeholder?: string;
  };
  isBusy?: boolean;
  label?: ReactNode;
  placeholder?: string;
  updateFiles?: (
    files: (File | TFile)[],
    action: "add" | "remove" | "update",
  ) => Promise<void> | void;
  variant?: (typeof FILE_INPUT_VARIANTS)[number];
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
}: FileInputProps<TFile>) {
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
      await updateFiles([...event.target.files], "add");
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
      await updateFiles?.([{ ...file, data: fileData }], "update");
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
                  {item.status === "uploading" ? (
                    <>
                      <div
                        className={clsx(
                          styles.listItemStatusText,
                          styles.progress,
                        )}
                      >
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
                  ) : item.status === "uploaded" ? (
                    <>
                      <div
                        className={clsx(
                          styles.listItemStatusText,
                          styles.success,
                        )}
                      >
                        Uploaded
                      </div>
                      <div>
                        <Button
                          onClick={() => void updateFiles?.([item], "remove")}
                          spacing="equal"
                          variant="borderless"
                        >
                          <IconTrashXFilled />
                        </Button>
                      </div>
                    </>
                  ) : (
                    item.status === "failed" && (
                      <>
                        <div
                          className={clsx(
                            styles.listItemStatusText,
                            styles.failed,
                          )}
                        >
                          Failed
                        </div>
                        <div>
                          <Button
                            onClick={() => void updateFiles?.([item], "add")}
                            spacing="equal"
                            variant="borderless"
                          >
                            <IconReload />
                          </Button>
                        </div>
                        <div>
                          <Button
                            onClick={() => void updateFiles?.([item], "remove")}
                            spacing="equal"
                            variant="borderless"
                          >
                            <IconTrashXFilled />
                          </Button>
                        </div>
                      </>
                    )
                  )}
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
                      key={index}
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
                      key={index}
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
