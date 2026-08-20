import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import JoinQueueForm from "./JoinQueueForm";
import { describe, it, expect, vi } from "vitest";
import * as api from "../../services/api";

vi.mock("../../services/api");

describe("JoinQueueForm Component", () => {
  it("renders form inputs and submit button", () => {
    render(<JoinQueueForm />);

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Service Type Requested/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Join Queue Now/i }),
    ).toBeInTheDocument();
  });

  it("calls joinQueue API on valid form submit", async () => {
    const mockTicket = { ticket_id: "uuid-123", ticket_number: "Q-101" };
    vi.spyOn(api, "joinQueue").mockResolvedValueOnce(mockTicket);
    const handleSuccess = vi.fn();

    render(<JoinQueueForm onSuccess={handleSuccess} />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "Alice Smith" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Join Queue Now/i }));

    await waitFor(() => {
      expect(api.joinQueue).toHaveBeenCalledWith(
        "Alice Smith",
        "Customer Service (General Inquiry)",
      );
      expect(handleSuccess).toHaveBeenCalledWith(mockTicket);
    });
  });
});
