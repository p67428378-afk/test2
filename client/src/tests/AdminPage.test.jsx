import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AdminPage from "../pages/AdminPage.jsx";

// Mock services
vi.mock("../services/api", () => ({
  authService: {
    getCurrentUser: vi.fn(() => ({
      username: "admin@example.com",
      role: "Administrator",
    })),
  },
  auditService: {
    getAuditLogs: vi.fn(() =>
      Promise.resolve([
        {
          id: "a1",
          user_id: "u1",
          username: "admin@example.com",
          action: "CASE_CREATED",
          details: { case_number: "CASE-1" },
          timestamp: "2026-01-01T00:00:00Z",
        },
      ]),
    ),
  },
}));

describe("AdminPage Component", () => {
  it("renders admin panel and audit logs", async () => {
    render(<AdminPage />);

    expect(await screen.findByText("Admin Panel")).toBeInTheDocument();
    expect(screen.getByText("CASE_CREATED")).toBeInTheDocument();
    expect(screen.getByText("admin@example.com")).toBeInTheDocument();
  });
});
