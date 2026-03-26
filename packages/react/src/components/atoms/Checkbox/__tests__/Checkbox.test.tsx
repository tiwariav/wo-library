import { render, screen, fireEvent } from "@testing-library/react";
import Checkbox from "../Checkbox.js";
import { expect, describe, it, jest } from "@jest/globals";
import React from "react";

describe("Checkbox", () => {
  it("renders with a label", () => {
    render(<Checkbox label="Test Checkbox" />);
    expect(screen.getByLabelText("Test Checkbox")).toBeTruthy();
  });

  it("handles change events", () => {
    const handleChange = jest.fn();
    render(<Checkbox label="Test Checkbox" onChange={handleChange} />);
    const checkbox = screen.getByLabelText("Test Checkbox");
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
  });

  it("can be disabled", () => {
    render(<Checkbox disabled label="Disabled Checkbox" />);
    const checkbox = screen.getByLabelText("Disabled Checkbox");
    expect((checkbox as HTMLInputElement).disabled).toBe(true);
  });
});
