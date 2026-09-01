import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FilterToolbar from "./FilterToolbar";

describe("FilterToolbar Component", () => {
  it("renders radius and sorting dropdowns", () => {
    const filters = {
      radius_km: 5,
      max_rate: null,
      spot_type: null,
      sort_by: "distance",
    };
    render(<FilterToolbar filters={filters} onChange={() => {}} />);
    expect(screen.getByText(/Search Radius/i)).toBeInTheDocument();
    expect(screen.getByText(/Sort Results By/i)).toBeInTheDocument();
  });

  it("triggers onChange when dropdown selection changes", () => {
    const handleChange = vi.fn();
    const filters = {
      radius_km: 5,
      max_rate: null,
      spot_type: null,
      sort_by: "distance",
    };
    render(<FilterToolbar filters={filters} onChange={handleChange} />);
    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], { target: { value: "10" } });
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ radius_km: 10 }),
    );
  });
});
