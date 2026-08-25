import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminLoginForm from "../components/admin/AdminLoginForm";

vi.mock("../services/api", () => ({
  adminFineService: {
    listFines: vi.fn().mockResolvedValue([
      {
        id: "fine-1",
        ticket_number: "FN-10001",
        license_plate: "XYZ-5678",
        violation_type: "Overtime Parking",
        location: "Zone 4 - Main St",
        amount: 35.0,
        status: "UNPAID",
        issue_date: "2026-05-18T10:00:00Z",
        due_date: "2026-06-18T10:00:00Z",
      },
    ]),
    listAuditLogs: vi.fn().mockResolvedValue([
      {
        id: "log-1",
        fine_id: "fine-1",
        actor_id: "admin@example.com",
        action: "CREATE_FINE",
        notes: "Issued citation FN-10001",
        created_at: "2026-05-18T10:00:00Z",
      },
    ]),
    createFine: vi.fn().mockResolvedValue({}),
    updateFine: vi.fn().mockResolvedValue({}),
    voidFine: vi.fn().mockResolvedValue({}),
  },
  authService: {
    isAuthenticated: () => true,
    logout: vi.fn(),
  },
}));

describe("Admin Dashboard Management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders AdminLoginForm with test credentials note", () => {
    const handleLogin = vi.fn();
    render(<AdminLoginForm onLogin={handleLogin} isLoading={false} error="" />);

    expect(screen.getByText(/Sign In to Admin Portal/i)).toBeInTheDocument();
    expect(
      screen.getByText(/admin@example\.com \/ adminpassword/i),
    ).toBeInTheDocument();
  });

  it("renders AdminDashboardPage metrics and fine table", async () => {
    render(
      <BrowserRouter>
        <AdminDashboardPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Admin Fine Management Dashboard/i),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("FN-10001")).toBeInTheDocument();
    expect(screen.getByText("XYZ-5678")).toBeInTheDocument();
  });

  it("opens Issue New Fine modal on button click", async () => {
    render(
      <BrowserRouter>
        <AdminDashboardPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Issue New Fine/i)).toBeInTheDocument();
    });

    const issueBtn = screen.getByRole("button", { name: /Issue New Fine/i });
    fireEvent.click(issueBtn);

    expect(screen.getByText(/Issue New Parking Citation/i)).toBeInTheDocument();
  });
});
