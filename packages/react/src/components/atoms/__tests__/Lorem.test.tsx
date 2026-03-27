import { render } from "@testing-library/react";
import Lorem from "../Lorem.js";
import { expect, describe, it } from "@jest/globals";
import React from "react";

describe("Lorem", () => {
  it("security: does not render malicious tags via suffix", () => {
    const maliciousPayload = "<img src=x onerror=alert(1)><script>alert(1)</script><style>body{color:red}</style>";
    const { container } = render(<Lorem suffix={maliciousPayload} />);

    // The img, script, and style tags should be stripped
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("style")).toBeNull();
  });

  it("security: strips attributes from allowed tags", () => {
    const maliciousPayload = "<b onmouseover=alert(1)>Bold Text</b>";
    const { container } = render(<Lorem suffix={maliciousPayload} />);

    const b = container.querySelector("b");
    expect(b).toBeTruthy();
    // The onmouseover attribute should be stripped
    expect(b?.getAttribute("onmouseover")).toBeNull();
  });

  it("renders content from loremIpsum", () => {
    const { container } = render(<Lorem count={1} units="words" />);
    expect(container.textContent).toBeTruthy();
  });
});
