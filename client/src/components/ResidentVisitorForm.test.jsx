import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ResidentVisitorForm from "./ResidentVisitorForm.jsx";
import * as api from "../services/api";

vi.mock("../services/api", () => ({
  createVisitorPreApproval: vi.fn(),
}));

describe("ResidentVisitorForm Component", () => {
  it("renders form inputs and submit button", () => {
    render(<ResidentVisitorForm />);
    expect(screen.getByText(/Pre-Approve New Visitor/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("Bob Smith")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Unit 4B")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Generate Time-Bound QR Token/i }),
    ).toBeInTheDocument();
  });

  it("submits form payload on click", async () => {
    vi.spyOn(api, "createVisitorPreApproval").mockResolvedValueOnce({
      visitor_id: "v-123",
      unit_number: "Unit 4B",
      visitor_name: "Bob Smith",
      qr_token: "QR_SIGNATURE_TEST",
      status: "ACTIVE",
    });

    const onCreated = vi.fn();
    render(<ResidentVisitorForm onVisitorCreated={onCreated} />);

    const submitBtn = screen.getByRole("button", {
      name: /Generate Time-Bound QR Token/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.createVisitorPreApproval).toHaveBeenCalled();
      expect(onCreated).toHaveBeenCalled();
    });
  });
});
