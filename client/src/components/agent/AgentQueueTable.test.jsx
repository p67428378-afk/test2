import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AgentQueueTable from "./AgentQueueTable";
import { describe, it, expect, vi } from "vitest";
import * as api from "../../services/api";

vi.mock("../../services/api");

describe("AgentQueueTable Component", () => {
  const mockTickets = [
    {
      ticket_id: "uuid-1",
      ticket_number: "Q-101",
      customer_name: "Bob",
      service_type: "General",
      status: "Waiting",
      position_in_line: 1,
      counter_number: null,
    },
  ];

  it("renders queue tickets in table", () => {
    render(<AgentQueueTable tickets={mockTickets} />);

    expect(screen.getByText("Q-101")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Call Next")).toBeInTheDocument();
  });

  it("triggers status update on Call Next button click", async () => {
    vi.spyOn(api, "updateTicketStatus").mockResolvedValueOnce({
      ...mockTickets[0],
      status: "In Progress",
      counter_number: "Counter 1",
    });
    const handleRefresh = vi.fn();

    render(<AgentQueueTable tickets={mockTickets} onRefresh={handleRefresh} />);

    fireEvent.click(screen.getByRole("button", { name: /Call Next/i }));

    await waitFor(() => {
      expect(api.updateTicketStatus).toHaveBeenCalledWith(
        "uuid-1",
        "In Progress",
        "Counter 1",
      );
      expect(handleRefresh).toHaveBeenCalled();
    });
  });
});
