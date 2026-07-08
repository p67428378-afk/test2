import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ToggleSwitch from "./ToggleSwitch";

describe("ToggleSwitch Component", () => {
  it("renders with correct label and state", () => {
    render(
      <ToggleSwitch enabled={true} onChange={() => {}} label="Test Toggle" />,
    );
    expect(screen.getByText("Test Toggle")).toBeInTheDocument();
    const button = screen.getByRole("switch");
    expect(button).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange when clicked", () => {
    const handleChange = vi.fn();
    render(
      <ToggleSwitch
        enabled={false}
        onChange={handleChange}
        label="Test Toggle"
      />,
    );
    const button = screen.getByRole("switch");
    fireEvent.click(button);
    expect(handleChange).toHaveBeenCalledWith(true);
  });
});
