import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import GiftSubscriptionCard from "../boxes/GiftSubscriptionCard";
import * as api from "../../services/api";

vi.mock("../../services/api", () => ({
  createGiftSubscription: vi.fn(),
}));

describe("GiftSubscriptionCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <GiftSubscriptionCard
        boxId="box-1"
        boxTitle="Deluxe Beauty Box"
        isOpen={false}
        onClose={() => {}}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders gift subscription form inputs correctly when isOpen is true", () => {
    render(
      <GiftSubscriptionCard
        boxId="box-1"
        boxTitle="Deluxe Beauty Box"
        isOpen={true}
        onClose={() => {}}
      />,
    );

    expect(screen.getByText("Gift This Subscription")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/example\.com/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        /Happy Birthday! Hope you enjoy this curated subscription box./i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Send Gift Subscription/i }),
    ).toBeInTheDocument();
  });

  it("submits gift subscription form with recipient email and message", async () => {
    api.createGiftSubscription.mockResolvedValueOnce({
      id: "gift-123",
      box_id: "box-1",
      recipient_email: "friend@example.com",
      message: "Happy Birthday!",
      status: "pending",
      created_at: new Date().toISOString(),
    });

    render(
      <GiftSubscriptionCard
        boxId="box-1"
        boxTitle="Deluxe Beauty Box"
        isOpen={true}
        onClose={() => {}}
      />,
    );

    const emailInput = screen.getByPlaceholderText(/example\.com/i);
    const messageInput = screen.getByPlaceholderText(
      /Happy Birthday! Hope you enjoy this curated subscription box./i,
    );
    const submitButton = screen.getByRole("button", {
      name: /Send Gift Subscription/i,
    });

    fireEvent.change(emailInput, { target: { value: "friend@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Happy Birthday!" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.createGiftSubscription).toHaveBeenCalledWith("box-1", {
        recipient_email: "friend@example.com",
        message: "Happy Birthday!",
      });
    });

    expect(
      await screen.findByText("Gift Subscription Created!"),
    ).toBeInTheDocument();
  });
});
