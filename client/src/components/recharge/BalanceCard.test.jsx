import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BalanceCard from "./BalanceCard";

describe("BalanceCard Component", () => {
  it("renders account details and formatted balance", () => {
    const mockAccount = {
      account_number: "1234567890",
      balance: 5000.5,
      status: "ACTIVE",
    };

    render(<BalanceCard account={mockAccount} />);

    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("ACTIVE")).toBeInTheDocument();
    // Check for formatted balance (INR format)
    expect(screen.getByText(/5,000\.50/)).toBeInTheDocument();
  });

  it("returns null when no account is provided", () => {
    const { container } = render(<BalanceCard account={null} />);
    expect(container.firstChild).toBeNull();
  });
});
