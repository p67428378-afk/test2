import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SizeSelector from "./SizeSelector";

describe("SizeSelector Component", () => {
  it("renders all three box sizes", () => {
    render(<SizeSelector selectedSize="Medium" onChange={() => {}} />);

    expect(screen.getByText("The Taster")).toBeInTheDocument();
    expect(screen.getByText("The Connoisseur")).toBeInTheDocument();
    expect(screen.getByText("The Chocolatier")).toBeInTheDocument();
  });

  it("calls onChange when a size is clicked", () => {
    const handleChange = vi.fn();
    render(<SizeSelector selectedSize="Medium" onChange={handleChange} />);

    const tasterRadio = screen.getByLabelText("The Taster");
    fireEvent.click(tasterRadio);

    expect(handleChange).toHaveBeenCalledWith("Small");
  });
});
