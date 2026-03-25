import type { ForwardedRef } from "react";

import { render, screen } from "@testing-library/react";

import {
  COMPONENT_FLOAT,
  COMPONENT_SIZES,
  COMPONENT_SPACINGS,
} from "../constants/props.js";
import { iconArgTypes, storyIconControl, storyIconMap } from "../storybook.js";
import UploadFile from "../uploadFile.js";
import { genericForwardRef, getDynamicClassName, isBrowser } from "../utils.js";

describe("tools/constants/props", () => {
  test("exports component constants", () => {
    expect(COMPONENT_SIZES).toEqual(["small", "large"]);
    expect(COMPONENT_SPACINGS).toEqual(["less", "extra"]);
    expect(COMPONENT_FLOAT).toEqual([
      "highest",
      "high",
      "medium",
      "low",
      "lowest",
    ]);
  });
});

describe("tools/storybook", () => {
  test("exports icon maps and controls", () => {
    expect(Object.keys(storyIconMap)).toContain("Search");
    expect(storyIconControl.options).toContain("None");
    expect(iconArgTypes.iconAfter.options).toEqual(Object.keys(storyIconMap));
    expect(iconArgTypes.iconBefore.mapping).toEqual(storyIconMap);
  });
});

describe("tools/uploadFile", () => {
  test("initializes with defaults", () => {
    const file = new File(["abc"], "a.txt");
    const upload = new UploadFile(file);

    expect(upload.file).toBe(file);
    expect(upload.id.startsWith("upload_file_")).toBe(true);
    expect(upload.status).toBe("new");
    expect(upload.data).toBeUndefined();
    expect(upload.type).toBeUndefined();
  });

  test("initializes with provided options", () => {
    const file = new File(["abc"], "a.txt");
    const upload = new UploadFile(file, {
      data: [{ name: "p", type: "preview", value: "1" }],
      status: "uploading",
      type: "avatar",
    });

    expect(upload.status).toBe("uploading");
    expect(upload.data?.[0].name).toBe("p");
    expect(upload.type).toBe("avatar");
  });
});

describe("tools/utils", () => {
  test("isBrowser resolves true in jsdom", () => {
    expect(isBrowser).toBe(true);
  });

  test("getDynamicClassName resolves camelCase keys", () => {
    const styles = { myClassName: "_abc" };
    expect(getDynamicClassName(styles, "my-class-name")).toBe("_abc");
  });

  test("genericForwardRef sets displayName and forwards ref", () => {
    const TestComponent = genericForwardRef<
      HTMLInputElement,
      { label: string }
    >(
      ({ label }, ref: ForwardedRef<HTMLInputElement>) => (
        <input aria-label={label} ref={ref} />
      ),
      "TestComponent",
    );

    let refNode: HTMLInputElement | null = null;
    render(
      <TestComponent
        label="name"
        ref={(node: HTMLInputElement | null) => {
          refNode = node;
        }}
      />,
    );

    expect(screen.getByLabelText("name")).toBeTruthy();
    expect(
      (TestComponent as unknown as { displayName?: string }).displayName,
    ).toBe("TestComponent");
    expect(refNode?.tagName).toBe("INPUT");
  });
});
