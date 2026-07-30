import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import CreateDonationForm from "./CreateDonationForm";
import { donationService } from "../services/api";

// Mock the api service
vi.mock("../services/api", () => ({
  donationService: {
    createDonation: vi.fn(),
  },
  authService: {
    getCurrentUser: vi.fn(() => ({
      id: "1",
      role: "restaurant",
      full_name: "Test Restaurant",
    })),
  },
}));

describe("CreateDonationForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form fields correctly", () => {
    render(<CreateDonationForm />);
    expect(
      screen.getByLabelText(/Food Item\/Description \*/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Quantity \*/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Best Before Date & Time \*/i),
    ).toBeInTheDocument();
  });

  it("submits the form successfully", async () => {
    donationService.createDonation.mockResolvedValueOnce({ id: "123" });

    render(<CreateDonationForm onSuccess={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/Food Item\/Description \*/i), {
      target: { value: "Pasta" },
    });
    fireEvent.change(screen.getByLabelText(/Quantity \*/i), {
      target: { value: "5 portions" },
    });
    fireEvent.change(screen.getByLabelText(/Best Before Date & Time \*/i), {
      target: { value: "2026-08-01T18:00" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Post Donation/i }));

    await waitFor(() => {
      expect(donationService.createDonation).toHaveBeenCalled();
      expect(
        screen.getByText(/Donation posted successfully!/i),
      ).toBeInTheDocument();
    });
  });

  it("shows error message on API failure", async () => {
    donationService.createDonation.mockRejectedValueOnce({
      response: { data: { detail: "Failed to create" } },
    });

    render(<CreateDonationForm />);

    fireEvent.change(screen.getByLabelText(/Food Item\/Description \*/i), {
      target: { value: "Pasta" },
    });
    fireEvent.change(screen.getByLabelText(/Quantity \*/i), {
      target: { value: "5 portions" },
    });
    fireEvent.change(screen.getByLabelText(/Best Before Date & Time \*/i), {
      target: { value: "2026-08-01T18:00" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Post Donation/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to create/i)).toBeInTheDocument();
    });
  });
});
