import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import UpsellBanner from "./UpsellBanner";
import { subscriptionService } from "../../services/api";

vi.mock("../../services/api", () => ({
  subscriptionService: {
    getUpsellEligibility: vi.fn(),
    dismissUpsellBanner: vi.fn(),
    createSubscription: vi.fn(),
  },
}));

describe("UpsellBanner Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when not eligible", async () => {
    subscriptionService.getUpsellEligibility.mockResolvedValue({
      is_eligible: false,
      last_order: null,
    });

    const { container } = render(
      <MemoryRouter>
        <UpsellBanner />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it("renders banner when eligible", async () => {
    subscriptionService.getUpsellEligibility.mockResolvedValue({
      is_eligible: true,
      last_order: {
        id: "order-123",
        box_size: "Large",
        price: 45.0,
        product_id: "prod-123",
      },
    });

    render(
      <MemoryRouter>
        <UpsellBanner />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Love our chocolates\?/i)).toBeInTheDocument();
      expect(screen.getByText(/Large Chocolate Box/i)).toBeInTheDocument();
    });
  });

  it("handles dismiss action", async () => {
    subscriptionService.getUpsellEligibility.mockResolvedValue({
      is_eligible: true,
      last_order: {
        id: "order-123",
        box_size: "Large",
        price: 45.0,
        product_id: "prod-123",
      },
    });
    subscriptionService.dismissUpsellBanner.mockResolvedValue({
      status: "success",
      dismissed_at: "2026-07-14T10:00:00Z",
    });

    render(
      <MemoryRouter>
        <UpsellBanner />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Dismiss/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Dismiss/i));

    await waitFor(() => {
      expect(subscriptionService.dismissUpsellBanner).toHaveBeenCalled();
    });
  });

  it("handles convert action", async () => {
    subscriptionService.getUpsellEligibility.mockResolvedValue({
      is_eligible: true,
      last_order: {
        id: "order-123",
        box_size: "Large",
        price: 45.0,
        product_id: "prod-123",
      },
    });
    subscriptionService.createSubscription.mockResolvedValue({
      id: "sub-123",
      status: "active",
    });

    const handleConvertSuccess = vi.fn();

    render(
      <MemoryRouter>
        <UpsellBanner onConvertSuccess={handleConvertSuccess} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Convert to Subscription & Save 10%/i),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Convert to Subscription & Save 10%/i));

    await waitFor(() => {
      expect(subscriptionService.createSubscription).toHaveBeenCalledWith(
        "Large",
        4,
        "tok_visa",
      );
      expect(handleConvertSuccess).toHaveBeenCalled();
    });
  });
});
