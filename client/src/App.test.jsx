import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock API calls
vi.mock("./services/api", () => ({
  getVisitorPreApprovals: vi.fn().mockResolvedValue([]),
  getDeliveries: vi.fn().mockResolvedValue([]),
  getOverdueDeliveries: vi.fn().mockResolvedValue([]),
  getSecurityAlerts: vi.fn().mockResolvedValue([]),
  createVisitorPreApproval: vi.fn().mockResolvedValue({}),
  validateQREntry: vi.fn().mockResolvedValue({}),
  logDelivery: vi.fn().mockResolvedValue({}),
  collectDelivery: vi.fn().mockResolvedValue({}),
  createSecurityAlert: vi.fn().mockResolvedValue({}),
  cancelSecurityAlert: vi.fn().mockResolvedValue({}),
}));

describe("App Smoke Test", () => {
  it("renders application navigation and title", async () => {
    render(<App />);
    expect(screen.getByText(/Visitor Management System/i)).toBeInTheDocument();
    expect(screen.getByText(/Resident Portal/i)).toBeInTheDocument();
    expect(screen.getByText(/Guard Terminal/i)).toBeInTheDocument();
    expect(screen.getByText(/Delivery Packages/i)).toBeInTheDocument();
  });
});
