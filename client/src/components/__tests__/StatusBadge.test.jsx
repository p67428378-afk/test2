import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatusBadge from "../StatusBadge.jsx";

describe("StatusBadge Component", () => {
  it("renders room Available status properly", () => {
    render(<StatusBadge status="Available" type="room" />);
    expect(screen.getByTestId("status-badge")).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();
  });

  it("renders reservation CHECKED_IN status formatted", () => {
    render(<StatusBadge status="CHECKED_IN" type="reservation" />);
    expect(screen.getByText("Checked In")).toBeInTheDocument();
  });

  it("renders invoice PAID status properly", () => {
    render(<StatusBadge status="PAID" type="invoice" />);
    expect(screen.getByText("PAID")).toBeInTheDocument();
  });
});
