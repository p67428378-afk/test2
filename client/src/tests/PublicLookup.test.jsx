import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PublicLookupPage from "../pages/PublicLookupPage";
import FineSearchCard from "../components/fines/FineSearchCard";
import FineDetailsCard from "../components/fines/FineDetailsCard";

vi.mock("../services/api", () => ({
  publicFineService: {
    searchFines: vi.fn().mockResolvedValue([
      {
        id: "fine-uuid-123",
        ticket_number: "FN-98765",
        license_plate: "ABC-1234",
        violation_type: "Overtime Parking",
        location: "Zone 4 - Main St",
        amount: 50.0,
        status: "UNPAID",
        issue_date: "2026-05-01T10:00:00Z",
        due_date: "2026-06-01T10:00:00Z",
      },
    ]),
    getFineStatus: vi.fn().mockResolvedValue({
      id: "fine-uuid-123",
      ticket_number: "FN-98765",
      status: "UNPAID",
      amount: 50.0,
      overdue_penalty: 0.0,
      total_due: 50.0,
      due_date: "2026-06-01T10:00:00Z",
    }),
  },
  authService: {
    isAuthenticated: () => false,
    logout: vi.fn(),
  },
}));

describe("Public Fine Lookup & Verification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders PublicLookupPage correctly", () => {
    render(
      <BrowserRouter>
        <PublicLookupPage />
      </BrowserRouter>,
    );

    expect(
      screen.getByText(/City Parking Citation Portal/i),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. ABC-1234/i)).toBeInTheDocument();
  });

  it("allows toggling between license plate and ticket reference search", () => {
    render(
      <BrowserRouter>
        <PublicLookupPage />
      </BrowserRouter>,
    );

    const ticketTabBtn = screen.getByRole("button", {
      name: /Ticket Reference/i,
    });
    fireEvent.click(ticketTabBtn);

    expect(screen.getByPlaceholderText(/e\.g\. FN-98765/i)).toBeInTheDocument();
  });

  it("renders FineDetailsCard with proper status badge and amounts", () => {
    const mockFine = {
      id: "test-1",
      ticket_number: "FN-10001",
      license_plate: "XYZ-5678",
      violation_type: "Expired Meter",
      location: "Downtown Lot",
      amount: 35.0,
      status: "PAID",
      issue_date: "2026-05-10T10:00:00Z",
      due_date: "2026-06-10T10:00:00Z",
      payment_timestamp: "2026-05-15T12:00:00Z",
      transaction_reference: "TXN-998877",
    };

    render(
      <FineDetailsCard fine={mockFine} statusDetails={{ total_due: 35.0 }} />,
    );

    expect(screen.getByText("FN-10001")).toBeInTheDocument();
    expect(screen.getByText("XYZ-5678")).toBeInTheDocument();
    expect(screen.getByText("Expired Meter")).toBeInTheDocument();
    expect(screen.getByText("PAID")).toBeInTheDocument();
  });
});
