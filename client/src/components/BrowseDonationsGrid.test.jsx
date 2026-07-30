import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import BrowseDonationsGrid from "./BrowseDonationsGrid";
import { donationService } from "../services/api";

vi.mock("../services/api", () => ({
  donationService: {
    requestDonation: vi.fn(),
  },
}));

describe("BrowseDonationsGrid Component", () => {
  const mockDonations = [
    {
      id: "don-1",
      description: "Fresh Apples",
      restaurant_name: "Apple Orchard",
      quantity: "10 kg",
      food_type: "Fruit",
      best_before_dt: "2026-08-01T18:00:00Z",
      pickup_location: "123 Apple St",
      status: "available",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders donations correctly", () => {
    render(<BrowseDonationsGrid donations={mockDonations} />);
    expect(screen.getByText("Fresh Apples")).toBeInTheDocument();
    expect(screen.getByText(/Apple Orchard/i)).toBeInTheDocument();
    expect(screen.getByText(/10 kg/i)).toBeInTheDocument();
  });

  it("handles request donation successfully", async () => {
    donationService.requestDonation.mockResolvedValueOnce({});
    const handleRequested = vi.fn();

    render(
      <BrowseDonationsGrid
        donations={mockDonations}
        onRequested={handleRequested}
      />,
    );

    const requestBtn = screen.getByRole("button", {
      name: /Request Donation/i,
    });
    fireEvent.click(requestBtn);

    await waitFor(() => {
      expect(donationService.requestDonation).toHaveBeenCalledWith("don-1");
      expect(handleRequested).toHaveBeenCalled();
    });
  });
});
