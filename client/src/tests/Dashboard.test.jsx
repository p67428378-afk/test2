import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MetricGroup from "../components/inventory/MetricGroup";
import LowStockAlerts from "../components/inventory/LowStockAlerts";

describe("MetricGroup Component", () => {
  it("renders all metric cards with correct values", () => {
    const items = [{ id: "1", unit_price: 10 }];
    const inventory = [{ item_id: "1", current_stock: 5 }];
    const warehouses = [{ id: "w1", name: "Warehouse A" }];

    render(
      <MetricGroup
        items={items}
        lowStockCount={1}
        inventory={inventory}
        warehouses={warehouses}
      />,
    );

    expect(screen.getByText("Total Catalog Items")).toBeInTheDocument();
    expect(screen.getByText("Low Stock Alerts")).toBeInTheDocument();
    expect(screen.getByText("Total Stock Value")).toBeInTheDocument();
    expect(screen.getByText("Active Warehouses")).toBeInTheDocument();

    // Total Catalog Items value and Active Warehouses value are both "1"
    const ones = screen.getAllByText("1");
    expect(ones.length).toBeGreaterThanOrEqual(2);

    // Total Stock Value: 5 * 10 = $50.00
    expect(screen.getByText("$50.00")).toBeInTheDocument();
  });
});

describe("LowStockAlerts Component", () => {
  it("renders empty state when no alerts are present", () => {
    render(<LowStockAlerts alerts={[]} />);
    expect(
      screen.getByText(
        "All items are sufficiently stocked. No alerts at this time.",
      ),
    ).toBeInTheDocument();
  });

  it("renders table with alerts when present", () => {
    const alerts = [
      {
        sku: "SKU-001",
        name: "Test Item",
        warehouse: "Warehouse A",
        current_stock: 2,
        threshold: 5,
        status: "Low Stock",
      },
    ];

    render(<LowStockAlerts alerts={alerts} />);
    expect(screen.getByText("SKU-001")).toBeInTheDocument();
    expect(screen.getByText("Test Item")).toBeInTheDocument();
    expect(screen.getByText("Warehouse A")).toBeInTheDocument();
  });
});
