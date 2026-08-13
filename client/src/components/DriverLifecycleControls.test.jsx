import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DriverLifecycleControls from "./DriverLifecycleControls";

describe("DriverLifecycleControls Component", () => {
  it("renders fallback when no booking is provided", () => {
    render(<DriverLifecycleControls booking={null} />);
    expect(
      screen.getByText(/No active delivery task assigned/i),
    ).toBeInTheDocument();
  });

  it("renders task details and lifecycle transition button for assigned booking", () => {
    const mockBooking = {
      id: "12345678-90ab-cdef-1234-567890abcdef",
      delivery_address: "456 Ocean Drive",
      volume_liters: 5000,
      status: "ASSIGNED",
    };

    render(<DriverLifecycleControls booking={mockBooking} />);
    expect(screen.getByText(/456 Ocean Drive/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Start Trip/i }),
    ).toBeInTheDocument();
  });
});
