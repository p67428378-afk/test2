import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PositionTrackerCard from "./PositionTrackerCard";
import { describe, it, expect, vi } from "vitest";
import * as api from "../../services/api";

vi.mock("../../services/api");

describe("PositionTrackerCard Component", () => {
  const mockTicket = {
    ticket_id: "uuid-101",
    ticket_number: "Q-104",
    customer_name: "John Doe",
    service_type: "General Inquiry",
    status: "Waiting",
    position_in_line: 2,
    estimated_wait_minutes: 10,
    counter_number: null,
  };

  it("renders ticket details correctly", () => {
    render(<PositionTrackerCard ticket={mockTicket} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Q-104")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("10 Mins")).toBeInTheDocument();
  });

  it("handles ticket cancellation", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.spyOn(api, "updateTicketStatus").mockResolvedValueOnce({
      ...mockTicket,
      status: "Cancelled",
    });
    const handleCancel = vi.fn();

    render(<PositionTrackerCard ticket={mockTicket} onCancel={handleCancel} />);

    fireEvent.click(screen.getByRole("button", { name: /Cancel My Ticket/i }));

    await waitFor(() => {
      expect(api.updateTicketStatus).toHaveBeenCalledWith(
        "uuid-101",
        "Cancelled",
      );
      expect(handleCancel).toHaveBeenCalled();
    });
  });
});
