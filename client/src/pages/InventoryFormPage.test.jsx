// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import InventoryFormPage from "./InventoryFormPage.jsx";
import { inventoryService } from "../services/api.js";

// Mock the API services
vi.mock("../services/api.js", () => {
  return {
    inventoryService: {
      getInventoryItem: vi.fn(),
      createInventoryItem: vi.fn(),
      updateInventoryItem: vi.fn(),
    },
  };
});

describe("InventoryFormPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form for adding a new item", () => {
    render(
      <InventoryFormPage itemId={null} onCancel={vi.fn()} onSave={vi.fn()} />,
    );

    expect(screen.getByText("Add New Inventory Item")).toBeInTheDocument();
    expect(screen.getByLabelText("Item Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("Quantity *")).toBeInTheDocument();
  });

  it("loads and renders existing item details for editing", async () => {
    const mockItem = {
      item_id: "123",
      name: "Sterile Gloves",
      category: "PPE",
      quantity: 50,
      unit: "box",
      supplier: "Medline",
      low_stock_threshold: 10,
      description: "Box of 100 sterile gloves",
    };

    inventoryService.getInventoryItem.mockResolvedValue(mockItem);

    render(
      <InventoryFormPage itemId="123" onCancel={vi.fn()} onSave={vi.fn()} />,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("Sterile Gloves")).toBeInTheDocument();
    });

    expect(screen.getByText("Edit Inventory Item")).toBeInTheDocument();
  });
});
