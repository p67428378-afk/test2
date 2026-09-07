import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SecurityAlertTrigger from "./SecurityAlertTrigger.jsx";
import * as api from "../services/api";

vi.mock("../services/api", () => ({
  createSecurityAlert: vi.fn(),
}));

describe("SecurityAlertTrigger Component", () => {
  it("renders emergency alert panel and trigger button", () => {
    render(<SecurityAlertTrigger />);
    expect(
      screen.getByText(/Emergency Broadcast & Security Alert Control/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /TRIGGER REAL-TIME EMERGENCY BROADCAST/i,
      }),
    ).toBeInTheDocument();
  });

  it("triggers emergency alert on submit", async () => {
    vi.spyOn(api, "createSecurityAlert").mockResolvedValueOnce({
      alert_id: "a-100",
      location: "North Gate Barrier",
      severity: "HIGH",
      status: "ACTIVE",
    });

    const onAlertCreated = vi.fn();
    render(<SecurityAlertTrigger onAlertCreated={onAlertCreated} />);

    const triggerBtn = screen.getByRole("button", {
      name: /TRIGGER REAL-TIME EMERGENCY BROADCAST/i,
    });
    fireEvent.click(triggerBtn);

    await waitFor(() => {
      expect(api.createSecurityAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          alert_type: "UNAUTHORIZED_ENTRY",
          severity: "HIGH",
        }),
      );
      expect(onAlertCreated).toHaveBeenCalled();
    });
  });
});
