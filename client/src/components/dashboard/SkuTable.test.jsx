import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SkuTable from "./SkuTable";

describe("SkuTable Component", () => {
  const mockSkus = [
    {
      sku: "12345",
      product_name: "DG Chips 10oz",
      brand: "DG Private Brand",
      sub_category: "Chips",
      sales_velocity: 50,
      sales_trend: 8.0,
      status: "GROW",
    },
    {
      sku: "67890",
      product_name: "Brand X Pretzels",
      brand: "National Brand",
      sub_category: "Pretzels",
      sales_velocity: 30,
      sales_trend: -1.0,
      status: "MAINTAIN",
    },
  ];

  it("renders the table headers correctly", () => {
    render(<SkuTable skus={mockSkus} loading={false} />);

    expect(screen.getByText("SKU")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Sub-Cat")).toBeInTheDocument();
    expect(screen.getByText("Vel (U/W)")).toBeInTheDocument();
    expect(screen.getByText("Trend")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("renders the SKU rows correctly", () => {
    render(<SkuTable skus={mockSkus} loading={false} />);

    expect(screen.getByText("12345")).toBeInTheDocument();
    expect(screen.getByText("DG Chips 10oz")).toBeInTheDocument();
    expect(screen.getByText("DG Private Brand")).toBeInTheDocument();
    expect(screen.getAllByText("Chips")[0]).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("+8.0%")).toBeInTheDocument();
    expect(screen.getByText("Grow")).toBeInTheDocument();

    expect(screen.getByText("67890")).toBeInTheDocument();
    expect(screen.getByText("Brand X Pretzels")).toBeInTheDocument();
    expect(screen.getByText("National Brand")).toBeInTheDocument();
    expect(screen.getAllByText("Pretzels")[0]).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("-1.0%")).toBeInTheDocument();
    expect(screen.getByText("Maintain")).toBeInTheDocument();
  });

  it("renders loading state correctly", () => {
    render(<SkuTable skus={[]} loading={true} />);
    expect(
      screen.getByText("Loading SKU performance data..."),
    ).toBeInTheDocument();
  });

  it("renders empty state correctly", () => {
    render(<SkuTable skus={[]} loading={false} />);
    expect(
      screen.getByText("No SKUs found matching the criteria."),
    ).toBeInTheDocument();
  });
});
