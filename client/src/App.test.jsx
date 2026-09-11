import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";
import WorkflowStepper from "./components/WorkflowStepper";
import ApprovalActionPanel from "./components/ApprovalActionPanel";

// Mock API service calls to prevent network errors in vitest jsdom
vi.mock("./services/api", () => ({
  authService: {
    getStoredUser: () => ({
      email: "test@example.com",
      full_name: "Test Procurement Admin",
      role: "procurement_admin",
    }),
    login: vi
      .fn()
      .mockResolvedValue({
        access_token: "fake-jwt",
        user: { email: "test@example.com" },
      }),
    logout: vi.fn(),
  },
  contractService: {
    list: vi.fn().mockResolvedValue({ items: [], total: 0 }),
    getById: vi
      .fn()
      .mockResolvedValue({
        id: "cnt-1",
        title: "Test Contract",
        status: "Draft",
      }),
    getVersions: vi.fn().mockResolvedValue([]),
  },
  commentService: {
    getComments: vi.fn().mockResolvedValue([]),
  },
  approvalService: {
    getWorkflowHistory: vi.fn().mockResolvedValue([]),
  },
  reminderService: {
    list: vi.fn().mockResolvedValue([]),
  },
}));

describe("Vendor Contract Management Portal Frontend", () => {
  it("renders the main layout header and navbar", async () => {
    render(<App />);
    expect(screen.getByText(/Vendor Contract Portal/i)).toBeInTheDocument();
  });

  it("renders WorkflowStepper with stages", () => {
    render(<WorkflowStepper currentStatus="Legal Review" />);
    expect(
      screen.getByText(/Current Stage: Legal Review/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Legal Review/i)).toBeInTheDocument();
    expect(screen.getByText(/Finance Approval/i)).toBeInTheDocument();
  });

  it("renders ApprovalActionPanel with submit button in Draft status", () => {
    const contract = { id: "c1", status: "Draft" };
    render(
      <ApprovalActionPanel
        contract={contract}
        onSubmitAction={() => {}}
        submitting={false}
      />,
    );
    expect(screen.getByText(/Submit for Legal Review/i)).toBeInTheDocument();
  });
});
