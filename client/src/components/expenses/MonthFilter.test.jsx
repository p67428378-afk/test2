import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MonthFilter from "./MonthFilter";

describe("MonthFilter Component", () => {
  it("renders correctly with default options", () => {
    render(<MonthFilter selectedMonth="" onChange={() => {}} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("All Months")).toBeInTheDocument();
  });

  it("calls onChange when selecting a month", () => {
    const handleChange = vi.fn();
    render(
      <MonthFilter
        selectedMonth=""
        onChange={handleChange}
        availableMonths={["2026-05", "2026-04"]}
      />,
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "2026-05" } });
    expect(handleChange).toHaveBeenCalledWith("2026-05");
  });

  it("renders Clear Month Filter button when a month is selected and calls onChange on click", () => {
    const handleChange = vi.fn();
    render(
      <MonthFilter
        selectedMonth="2026-05"
        onChange={handleChange}
        availableMonths={["2026-05"]}
      />,
    );

    const clearBtn = screen.getByRole("button", {
      name: /clear month filter/i,
    });
    expect(clearBtn).toBeInTheDocument();
    fireEvent.click(clearBtn);
    expect(handleChange).toHaveBeenCalledWith("");
  });
});
