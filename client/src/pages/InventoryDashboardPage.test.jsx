// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import InventoryDashboardPage from "./InventoryDashboardPage.jsx";
import { inventoryService } from "../services/api.js";

// Mock the API services
vi.mock("../services/api.js", () => {
  return {
    inventoryService: {
      getInventoryItems: vi.fn(),
      deleteInventoryItem: vi.fn(),
    },
  };
});

describe("InventoryDashboardPage Component", () => {
  const mockUser = { role: "librarian", full_name: "Admin User" };
  const mockItems = [
    {
      item_id: "1",
      name: "Sterile Gloves",
      category: "PPE",
      quantity: 50,
      unit: "box",
      supplier: "Medline",
      is_low_stock: false,
      low_stock_threshold: 10,
    },
    {
      item_id: "2",
      name: "Surgical Mask",
      category: "PPE",
      quantity: 5,
      unit: "box",
      supplier: "3M",
      is_low_stock: true,
      low_stock_threshold: 10,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    inventoryService.getInventoryItems.mockResolvedValue(mockItems);
  });

  it("renders the dashboard with KPI cards and inventory table", async () => {
    render(
      <InventoryDashboardPage
        user={mockUser}
        onAddItem={vi.fn()}
        onEditItem={vi.fn()}
      />,
    );

    // Wait for items to load
    await waitFor(() => {
      expect(screen.getByText("Sterile Gloves")).toBeInTheDocument();
    });

    // Check KPI cards
    expect(screen.getByText("Total Items")).toBeInTheDocument();
    expect(screen.getAllByText("Low Stock")[0]).toBeInTheDocument();

    // Check table headers
    expect(screen.getByText("Item Name")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Quantity")).toBeInTheDocument();
  });

  it("shows low stock alert banner when low stock items exist", async () => {
    render(
      <InventoryDashboardPage
        user={mockUser}
        onAddItem={vi.fn()}
        onEditItem={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/There are 1 items currently running low on stock/),
      ).toBeInTheDocument();
    });
  });
});
