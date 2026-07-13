import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FrequencySelector from "./FrequencySelector";

describe("FrequencySelector Component", () => {
  it("renders all frequency options", () => {
    render(<FrequencySelector selectedFrequency={4} onChange={() => {}} />);

    expect(screen.getByText("Every 2 Weeks")).toBeInTheDocument();
    expect(screen.getByText("Every 4 Weeks")).toBeInTheDocument();
    expect(screen.getByText("Every 6 Weeks")).toBeInTheDocument();
  });

  it("calls onChange when a frequency is clicked", () => {
    const handleChange = vi.fn();
    render(<FrequencySelector selectedFrequency={4} onChange={handleChange} />);

    const twoWeeksRadio = screen.getByLabelText("Every 2 Weeks");
    fireEvent.click(twoWeeksRadio);

    expect(handleChange).toHaveBeenCalledWith(2);
  });
});
