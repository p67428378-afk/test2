import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import SKUPerformanceTable from "./SKUPerformanceTable.jsx";

describe("SKUPerformanceTable Component", () => {
  const mockSKUs = [
    {
      sku: "Lay's Classic 13oz",
      sales_per_linear_ft: 18.2,
      is_private_brand: false,
      in_stock_rate: 0.985,
      status: "MAINTAIN",
    },
    {
      sku: "Clover Valley Potato Chips 10oz",
      sales_per_linear_ft: 22.4,
      is_private_brand: true,
      in_stock_rate: 0.942,
      status: "GROW",
    },
  ];

  it("renders loading state", () => {
    render(
      <SKUPerformanceTable
        loading={true}
        onSort={vi.fn()}
        onFilter={vi.fn()}
      />,
    );
    expect(screen.queryByText("SKU Performance")).not.toBeInTheDocument();
  });

  it("renders SKU rows correctly", () => {
    render(
      <SKUPerformanceTable
        skus={mockSKUs}
        loading={false}
        onSort={vi.fn()}
        onFilter={vi.fn()}
      />,
    );
    expect(screen.getByText("Lay's Classic 13oz")).toBeInTheDocument();
    expect(
      screen.getByText("Clover Valley Potato Chips 10oz"),
    ).toBeInTheDocument();
    expect(screen.getByText("$18.20")).toBeInTheDocument();
    expect(screen.getByText("$22.40")).toBeInTheDocument();
  });

  it("triggers filter callback on change", () => {
    const handleFilter = vi.fn();
    render(
      <SKUPerformanceTable
        skus={mockSKUs}
        loading={false}
        onSort={vi.fn()}
        onFilter={handleFilter}
      />,
    );
    const select = screen.getByRole("combobox", { name: "" }); // first select is filter
    fireEvent.change(screen.getAllByRole("combobox")[0], {
      target: { value: "GROW" },
    });
    expect(handleFilter).toHaveBeenCalledWith("GROW");
  });
});
