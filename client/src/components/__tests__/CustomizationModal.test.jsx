import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CustomizationModal from "../boxes/CustomizationModal";
import * as api from "../../services/api";

vi.mock("../../services/api", () => ({
  getBoxCustomizations: vi.fn(),
  submitBoxCustomization: vi.fn(),
}));

describe("CustomizationModal Component", () => {
  const mockCustomizationData = {
    box_id: "box-1",
    curation_id: "cur-1",
    curation_theme: "Autumn Glow Essentials",
    max_swaps_allowed: 1,
    current_items: [
      {
        id: "item-1",
        name: "Hydrate & Glow Toner",
        description: "Currently in box",
        value: "$24",
      },
      {
        id: "item-2",
        name: "Rosehip Face Oil",
        description: "Organic blend",
        value: "$32",
      },
    ],
    available_replacements: [
      {
        id: "rep-1",
        name: "Charcoal Detox Clay Mask",
        description: "Purifying mask",
        value: "$28",
        in_stock: true,
      },
      {
        id: "rep-2",
        name: "Out of Stock Cream",
        description: "Moisturizer",
        value: "$20",
        in_stock: false,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <CustomizationModal
        boxId="box-1"
        boxTitle="Deluxe Beauty Box"
        isOpen={false}
        onClose={() => {}}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders curation items and replacement options when open", async () => {
    api.getBoxCustomizations.mockResolvedValueOnce(mockCustomizationData);

    render(
      <CustomizationModal
        boxId="box-1"
        boxTitle="Deluxe Beauty Box"
        isOpen={true}
        onClose={() => {}}
      />,
    );

    expect(
      screen.getByText(/Customize Your Curation \(1 Swap Allowed\)/i),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Hydrate & Glow Toner/i)).toBeInTheDocument();
      expect(screen.getByText(/Charcoal Detox Clay Mask/i)).toBeInTheDocument();
    });
  });

  it("submits item customization swap when items are selected", async () => {
    api.getBoxCustomizations.mockResolvedValueOnce(mockCustomizationData);
    api.submitBoxCustomization.mockResolvedValueOnce({
      id: "custom-1",
      box_id: "box-1",
      curation_id: "cur-1",
      original_item_id: "item-1",
      replacement_item_id: "rep-1",
      status: "confirmed",
      created_at: new Date().toISOString(),
    });

    const onCustomizationConfirmed = vi.fn();

    render(
      <CustomizationModal
        boxId="box-1"
        boxTitle="Deluxe Beauty Box"
        isOpen={true}
        onClose={() => {}}
        onCustomizationConfirmed={onCustomizationConfirmed}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(/Hydrate & Glow Toner/i)).toBeInTheDocument();
    });

    // Select original item
    const origItem = screen.getByText(/Hydrate & Glow Toner/i);
    fireEvent.click(origItem);

    // Select replacement item
    const repItem = screen.getByText(/Charcoal Detox Clay Mask/i);
    fireEvent.click(repItem);

    // Click submit
    const submitBtn = screen.getByRole("button", {
      name: /Save Customization & Continue/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.submitBoxCustomization).toHaveBeenCalledWith("box-1", {
        original_item_id: "item-1",
        replacement_item_id: "rep-1",
      });
      expect(onCustomizationConfirmed).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByText("Customization Saved!")).toBeInTheDocument();
  });
});
