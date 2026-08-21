import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ExchangeDashboard from "../components/ExchangeDashboard.jsx";

describe("ExchangeDashboard component", () => {
  const mockRequests = [
    {
      id: "req-1",
      requester_id: "user-2",
      requester_name: "Bob Smith",
      recipient_id: "user-1",
      recipient_name: "Test User",
      offered_skill_id: "sk-1",
      offered_skill_name: "FastAPI",
      requested_skill_id: "sk-2",
      requested_skill_name: "React",
      status: "PENDING",
      message: "Let us trade knowledge!",
      created_at: "2026-01-01T12:00:00Z",
      updated_at: "2026-01-01T12:00:00Z",
    },
  ];

  it("renders exchange request list with status badge", () => {
    render(
      <ExchangeDashboard
        requests={mockRequests}
        isLoading={false}
        roleFilter="all"
        statusFilter=""
        onRoleFilterChange={vi.fn()}
        onStatusFilterChange={vi.fn()}
        onStatusUpdate={vi.fn()}
      />,
    );

    expect(screen.getByText(/Bob Smith → Test User/i)).toBeInTheDocument();
    expect(screen.getByText("FastAPI")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("triggers onStatusUpdate when Accept button is clicked", () => {
    const handleStatusUpdate = vi.fn().mockResolvedValue({});
    render(
      <ExchangeDashboard
        requests={mockRequests}
        isLoading={false}
        roleFilter="all"
        statusFilter=""
        onRoleFilterChange={vi.fn()}
        onStatusFilterChange={vi.fn()}
        onStatusUpdate={handleStatusUpdate}
      />,
    );

    const acceptBtn = screen.getByRole("button", { name: /Accept/i });
    fireEvent.click(acceptBtn);

    expect(handleStatusUpdate).toHaveBeenCalledWith("req-1", "ACCEPT");
  });
});
