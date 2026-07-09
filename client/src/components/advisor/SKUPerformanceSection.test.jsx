import { render, screen } from "@testing-library/react";
import React from "react";
import { expect, test } from "vitest";
import SKUPerformanceSection from "./SKUPerformanceSection.jsx";

test("renders SKU performance table with trend column and icons", () => {
  const items = [
    {
      sku: "SKU-1001",
      product_name: "Clover Valley Pretzels",
      sales: 1250.0,
      profit_margin: 35.0,
      days_of_supply: 15,
      status_badge: "GROW",
      trend_direction: "Up",
    },
    {
      sku: "SKU-1002",
      product_name: "Lay Potato Chips",
      sales: 950.0,
      profit_margin: 28.0,
      days_of_supply: 12,
      status_badge: "MAINTAIN",
      trend_direction: "Down",
    },
    {
      sku: "SKU-1003",
      product_name: "Doritos Nacho Cheese",
      sales: 1100.0,
      profit_margin: 30.0,
      days_of_supply: 18,
      status_badge: "OPTIMIZE",
      trend_direction: "Flat",
    },
  ];

  render(
    <SKUPerformanceSection
      items={items}
      loading={false}
      onRefresh={() => {}}
      total={3}
      page={1}
      limit={10}
      onPageChange={() => {}}
    />,
  );

  // Check table headers
  expect(screen.getByText("SKU")).toBeInTheDocument();
  expect(screen.getByText("Product Name")).toBeInTheDocument();
  expect(screen.getByText("Status & Trend")).toBeInTheDocument();

  // Check items
  expect(screen.getByText("SKU-1001")).toBeInTheDocument();
  expect(screen.getByText("Clover Valley Pretzels")).toBeInTheDocument();
  expect(screen.getByText("SKU-1002")).toBeInTheDocument();
  expect(screen.getByText("Lay Potato Chips")).toBeInTheDocument();

  // Check trend icons are rendered (via title attributes)
  expect(screen.getByTitle("Trend: Up")).toBeInTheDocument();
  expect(screen.getByTitle("Trend: Down")).toBeInTheDocument();
  expect(screen.getByTitle("Trend: Flat")).toBeInTheDocument();
});
