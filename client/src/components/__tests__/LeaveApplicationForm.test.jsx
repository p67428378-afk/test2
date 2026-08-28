import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LeaveApplicationForm, {
  calculateBusinessDays,
} from "../LeaveApplicationForm";
import api from "../../services/api";

vi.mock("../../services/api", () => ({
  default: {
    submitLeaveRequest: vi.fn(),
  },
}));

describe("calculateBusinessDays helper", () => {
  it("calculates 5 business days for a Monday to Friday span", () => {
    // 2026-06-01 is Monday, 2026-06-05 is Friday
    const days = calculateBusinessDays("2026-06-01", "2026-06-05");
    expect(days).toBe(5);
  });

  it("excludes weekend days", () => {
    // 2026-06-01 (Mon) to 2026-06-07 (Sun) -> 5 business days
    const days = calculateBusinessDays("2026-06-01", "2026-06-07");
    expect(days).toBe(5);
  });

  it("returns 0 if end date is before start date", () => {
    const days = calculateBusinessDays("2026-06-05", "2026-06-01");
    expect(days).toBe(0);
  });

  it("returns 0 for empty dates", () => {
    expect(calculateBusinessDays("", "")).toBe(0);
  });
});

describe("LeaveApplicationForm Component", () => {
  const mockUser = {
    id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    full_name: "John Doe",
    email: "test@example.com",
  };

  const mockBalances = [
    {
      leave_type: "VACATION",
      allocated_days: 15,
      used_days: 5,
      remaining_days: 10,
    },
    { leave_type: "SICK", allocated_days: 10, used_days: 1, remaining_days: 9 },
    {
      leave_type: "PERSONAL",
      allocated_days: 5,
      used_days: 0,
      remaining_days: 5,
    },
    {
      leave_type: "UNPAID",
      allocated_days: 0,
      used_days: 0,
      remaining_days: 0,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields properly", () => {
    render(
      <LeaveApplicationForm currentUser={mockUser} balances={mockBalances} />,
    );

    expect(screen.getByText("Apply for Leave")).toBeInTheDocument();
    expect(screen.getByLabelText(/Leave Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Reason for Leave/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Submit Request/i }),
    ).toBeInTheDocument();
  });

  it("submits form successfully when valid data is entered", async () => {
    const handleSubmitCallback = vi.fn();
    api.submitLeaveRequest.mockResolvedValueOnce({
      id: "c3a1e12f-876b-432a-9e12-32a11b987654",
      user_id: mockUser.id,
      leave_type: "VACATION",
      start_date: "2026-06-01",
      end_date: "2026-06-05",
      total_days: 5,
      reason: "Summer break",
      status: "PENDING",
    });

    render(
      <LeaveApplicationForm
        currentUser={mockUser}
        balances={mockBalances}
        onRequestSubmitted={handleSubmitCallback}
      />,
    );

    fireEvent.change(screen.getByLabelText(/Start Date/i), {
      target: { value: "2026-06-01" },
    });
    fireEvent.change(screen.getByLabelText(/End Date/i), {
      target: { value: "2026-06-05" },
    });
    fireEvent.change(screen.getByLabelText(/Reason for Leave/i), {
      target: { value: "Summer break" },
    });

    const submitBtn = screen.getByRole("button", { name: /Submit Request/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.submitLeaveRequest).toHaveBeenCalledWith({
        user_id: mockUser.id,
        leave_type: "VACATION",
        start_date: "2026-06-01",
        end_date: "2026-06-05",
        reason: "Summer break",
      });
      expect(handleSubmitCallback).toHaveBeenCalled();
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("displays an error alert when submission fails from server", async () => {
    api.submitLeaveRequest.mockRejectedValueOnce({
      response: { data: { detail: "Overlapping leave request exists." } },
    });

    render(
      <LeaveApplicationForm currentUser={mockUser} balances={mockBalances} />,
    );

    fireEvent.change(screen.getByLabelText(/Start Date/i), {
      target: { value: "2026-06-01" },
    });
    fireEvent.change(screen.getByLabelText(/End Date/i), {
      target: { value: "2026-06-05" },
    });
    fireEvent.change(screen.getByLabelText(/Reason for Leave/i), {
      target: { value: "Summer break" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Submit Request/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Overlapping leave request exists.",
      );
    });
  });
});
