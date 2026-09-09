import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SavedItemsList from "./SavedItemsList";
import { api } from "../services/api";

vi.mock("../services/api", () => ({
  api: {
    getSavedItems: vi.fn(),
    deleteSavedItem: vi.fn(),
  },
}));

describe("SavedItemsList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSavedResponse = {
    items: [
      {
        id: "save-101",
        product_id: "prod-101",
        user_id: "user-123",
        created_at: "2026-01-15T10:00:00Z",
        product: {
          id: "prod-101",
          name: "Wireless Noise-Canceling Headphones",
          category: "Audio",
          price: 199.99,
          rating: 4.8,
          description: "Premium sound experience.",
          tags: ["wireless", "audio"],
        },
      },
    ],
    total: 1,
    skip: 0,
    limit: 12,
  };

  it("renders saved products list after fetching", async () => {
    api.getSavedItems.mockResolvedValueOnce(mockSavedResponse);

    render(<SavedItemsList userId="user-123" />);

    await waitFor(() => {
      expect(
        screen.getByText("Wireless Noise-Canceling Headphones"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("$199.99")).toBeInTheDocument();
  });

  it("deletes a saved item when delete button is clicked", async () => {
    api.getSavedItems.mockResolvedValueOnce(mockSavedResponse);
    api.deleteSavedItem.mockResolvedValueOnce({
      status: "deleted",
      saved_id: "save-101",
    });
    api.getSavedItems.mockResolvedValueOnce({
      items: [],
      total: 0,
      skip: 0,
      limit: 12,
    });

    render(<SavedItemsList userId="user-123" />);

    await waitFor(() => {
      expect(
        screen.getByText("Wireless Noise-Canceling Headphones"),
      ).toBeInTheDocument();
    });

    const deleteBtn = screen.getByLabelText("Remove saved item");
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(api.deleteSavedItem).toHaveBeenCalledWith("save-101");
    });
  });
});
