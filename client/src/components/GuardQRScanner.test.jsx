import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import GuardQRScanner from "./GuardQRScanner.jsx";
import * as api from "../services/api";

vi.mock("../services/api", () => ({
  validateQREntry: vi.fn(),
}));

describe("GuardQRScanner Component", () => {
  it("renders scanner title and manual input", () => {
    render(<GuardQRScanner />);
    expect(
      screen.getByText(/Guard Gate Terminal Scanner/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Paste or scan QR token/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Scan & Validate Access/i }),
    ).toBeInTheDocument();
  });

  it("triggers validation on submit", async () => {
    vi.spyOn(api, "validateQREntry").mockResolvedValueOnce({
      access_granted: true,
      visitor_name: "Bob Smith",
      unit_number: "Unit 4B",
      message: "Access Granted",
    });

    const onResult = vi.fn();
    render(<GuardQRScanner onValidationResult={onResult} />);

    const tokenInput = screen.getByPlaceholderText(/Paste or scan QR token/i);
    fireEvent.change(tokenInput, { target: { value: "QR_SAMPLE_TOKEN" } });

    const submitBtn = screen.getByRole("button", {
      name: /Scan & Validate Access/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.validateQREntry).toHaveBeenCalledWith(
        expect.objectContaining({ qr_token: "QR_SAMPLE_TOKEN" }),
      );
      expect(onResult).toHaveBeenCalledWith(
        expect.objectContaining({ access_granted: true }),
      );
    });
  });
});
