import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LeaveHistoryTable from "../LeaveHistoryTable";

describe("LeaveHistoryTable Component", () => {
  const mockRequests = [
    {
      id: "req-001-vacation",
      leave_type: "VACATION",
      start_date: "2026-06-01",
      end_date: "2026-06-05",
      total_days: 5,
      reason: "Family Vacation",
      status: "APPROVED",
      manager_comment: "Approved by Jane",
    },
    {
      id: "req-002-sick",
      leave_type: "SICK",
      start_date: "2026-07-10",
      end_date: "2026-07-11",
      total_days: 2,
      reason: "Dental surgery",
      status: "PENDING",
      manager_comment: null,
    },
    {
      id: "req-003-personal",
      leave_type: "PERSONAL",
      start_date: "2026-08-15",
      end_date: "2026-08-15",
      total_days: 1,
      reason: "House moving",
      status: "REJECTED",
      manager_comment: "Team shortage on that date",
    },
  ];

  it("renders the table with requests and header", () => {
    render(<LeaveHistoryTable requests={mockRequests} />);

    expect(screen.getByText("My Leave Request History")).toBeInTheDocument();
    expect(screen.getByText("Family Vacation")).toBeInTheDocument();
    expect(screen.getByText("Dental surgery")).toBeInTheDocument();
    expect(screen.getByText("House moving")).toBeInTheDocument();
    expect(screen.getAllByText("Approved").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pending Review").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Rejected").length).toBeGreaterThan(0);
  });

  it("filters by status correctly", () => {
    render(<LeaveHistoryTable requests={mockRequests} />);

    const statusSelect = screen.getByLabelText(/Filter by Status/i);
    fireEvent.change(statusSelect, { target: { value: "APPROVED" } });

    expect(screen.getByText("Family Vacation")).toBeInTheDocument();
    expect(screen.queryByText("Dental surgery")).not.toBeInTheDocument();
    expect(screen.queryByText("House moving")).not.toBeInTheDocument();
  });

  it("displays empty state when no requests match", () => {
    render(<LeaveHistoryTable requests={[]} />);

    expect(screen.getByText("No leave requests found")).toBeInTheDocument();
  });

  it("renders error banner when error prop is provided", () => {
    render(
      <LeaveHistoryTable
        requests={[]}
        error="Network error fetching requests"
      />,
    );

    expect(
      screen.getByText("Network error fetching requests"),
    ).toBeInTheDocument();
  });
});
