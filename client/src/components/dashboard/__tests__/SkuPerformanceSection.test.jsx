import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SkuPerformanceSection from "../SkuPerformanceSection";

describe("SkuPerformanceSection", () => {
  const mockSkus = [
    {
      id: "11111111-2222-3333-4444-555555555555",
      product_name: "Chipz Salt & Vinegar 8oz",
      sku_code: "SNK-1001",
      sales_revenue: 4520,
      units_sold: 1205,
      profit_margin: 32,
      days_of_supply: 14,
      status_badge: "GROW",
    },
  ];

  it("renders loading state", () => {
    render(
      <SkuPerformanceSection
        skus={[]}
        loading={true}
        onSearchChange={vi.fn()}
        onSortChange={vi.fn()}
        sortBy=""
        sortOrder=""
      />,
    );
    expect(
      screen.getByText("Loading SKU performance data..."),
    ).toBeInTheDocument();
  });

  it("renders empty state when no SKUs", () => {
    render(
      <SkuPerformanceSection
        skus={[]}
        loading={false}
        onSearchChange={vi.fn()}
        onSortChange={vi.fn()}
        sortBy=""
        sortOrder=""
      />,
    );
    expect(
      screen.getByText("No SKUs found matching the criteria."),
    ).toBeInTheDocument();
  });

  it("renders SKU table when data is loaded", () => {
    render(
      <SkuPerformanceSection
        skus={mockSkus}
        loading={false}
        onSearchChange={vi.fn()}
        onSortChange={vi.fn()}
        sortBy=""
        sortOrder=""
      />,
    );
    expect(screen.getByText("Chipz Salt & Vinegar 8oz")).toBeInTheDocument();
    expect(screen.getByText("SNK-1001")).toBeInTheDocument();
    expect(screen.getByText("$4,520")).toBeInTheDocument();
    expect(screen.getByText("GROW")).toBeInTheDocument();
  });
});
