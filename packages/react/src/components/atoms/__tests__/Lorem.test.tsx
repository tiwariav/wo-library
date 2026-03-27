import { render, screen } from "@testing-library/react";
import Lorem from "../Lorem.js";
import { expect, describe, it } from "@jest/globals";
import React from "react";

describe("Lorem", () => {
  it("security: does not render malicious tags via suffix", () => {
    const maliciousPayload = "<img src=x onerror=alert(1)><script>alert(1)</script><style>body{color:red}</style>";
    render(<Lorem suffix={maliciousPayload} />);

    // The img, script, and style tags should be stripped
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("security: strips attributes from allowed tags", () => {
    const maliciousPayload = "<b data-testid='malicious-b' onmouseover=alert(1)>Bold Text</b>";
    render(<Lorem suffix={maliciousPayload} />);

    const b = screen.getByText("Bold Text");
    expect(b.tagName).toBe("B");
    // The onmouseover attribute should be stripped
    expect(b.getAttribute("onmouseover")).toBeNull();
    // Even other attributes should be stripped by our current logic
    expect(b.getAttribute("data-testid")).toBeNull();
  });

  it("renders content from loremIpsum", () => {
    render(<Lorem count={1} units="words" />);
    expect(screen.getByText(/.+/)).toBeTruthy();
  });
});
