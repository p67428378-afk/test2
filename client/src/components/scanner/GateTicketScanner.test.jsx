import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GateTicketScanner } from "./GateTicketScanner";

vi.mock("../../services/api", () => ({
  validateTicket: vi.fn().mockResolvedValue({
    status: "GRANTED",
    ticket_id: "T-99881",
    tier: "General Admission",
    scanned_at: "2026-08-15T14:00:00Z",
  }),
  syncOfflineTickets: vi.fn().mockResolvedValue({ synced_count: 1 }),
  createTicket: vi
    .fn()
    .mockResolvedValue({ id: "T-TEST", qr_payload: "TEST_QR" }),
}));

describe("GateTicketScanner Component", () => {
  it("renders header and scanner form", async () => {
    render(<GateTicketScanner />);
    expect(
      screen.getByText("Gate Security & Ticket Scanner"),
    ).toBeInTheDocument();
    expect(screen.getByText("Validate QR Ticket Payload")).toBeInTheDocument();
  });
});
