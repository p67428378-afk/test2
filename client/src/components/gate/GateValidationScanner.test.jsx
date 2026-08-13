import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GateValidationScanner from "./GateValidationScanner";

vi.mock("../../services/api", () => ({
  validateTicket: vi.fn().mockResolvedValue({
    status: "VALID",
    message: "Valid Ticket",
    tier: "General Admission",
  }),
}));

describe("GateValidationScanner Component", () => {
  it("renders scan input form and validates ticket on submission", async () => {
    render(<GateValidationScanner onScanResult={() => {}} />);

    const input = screen.getByPlaceholderText("e.g. TKT-GA-99201");
    fireEvent.change(input, { target: { value: "TKT-12345" } });

    const btn = screen.getByText("Validate Gate Scan");
    fireEvent.click(btn);

    expect(
      await screen.findByText("VALID TICKET - ENTRY GRANTED"),
    ).toBeInTheDocument();
  });
});
