import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "./App.jsx";
import * as api from "./services/api.js";

// Mock the API service
vi.mock("./services/api.js", () => ({
  uploadDamagePhotos: vi.fn(),
  getClaimEstimate: vi.fn(),
}));

describe("Instant Vehicle Damage Estimate App Flow", () => {
  it("renders upload page initially and handles file selection and submission", async () => {
    vi.mocked(api.uploadDamagePhotos).mockResolvedValue({
      claim_id: "test-claim-123",
    });
    vi.mocked(api.getClaimEstimate).mockResolvedValue({
      status: "READY",
      estimate: {
        total_cost: 1250.0,
        currency: "USD",
        breakdown: [
          { part: "Bumper", cost: 800.0 },
          { part: "Headlight", cost: 450.0 },
        ],
      },
    });

    render(<App />);

    // Verify initial upload page elements
    expect(screen.getByText("New Damage Estimate")).toBeInTheDocument();
    expect(screen.getByText("Step 1 of 2: Upload Photos")).toBeInTheDocument();

    // Submit button should be disabled initially
    const submitBtn = screen.getByRole("button", {
      name: "Submit for AI Estimate",
    });
    expect(submitBtn).toBeDisabled();

    // Select files
    const fileInput = screen.getByTestId("file-input");
    const files = [
      new File(["front"], "front.png", { type: "image/png" }),
      new File(["side"], "side.png", { type: "image/png" }),
      new File(["closeup"], "closeup.png", { type: "image/png" }),
    ];

    fireEvent.change(fileInput, { target: { files } });

    // Wait for files to be listed
    await waitFor(() => {
      expect(screen.getByText("front.png")).toBeInTheDocument();
      expect(screen.getByText("side.png")).toBeInTheDocument();
      expect(screen.getByText("closeup.png")).toBeInTheDocument();
    });

    // Submit button should now be enabled
    expect(submitBtn).not.toBeDisabled();

    // Click submit
    fireEvent.click(submitBtn);

    // Verify transition to results page and polling
    await waitFor(() => {
      expect(screen.getByText("AI Damage Estimate")).toBeInTheDocument();
    });

    // Verify estimate results are displayed
    await waitFor(() => {
      expect(screen.getByText("$1,250.00")).toBeInTheDocument();
      expect(screen.getByText("Bumper")).toBeInTheDocument();
      expect(screen.getByText("$800.00")).toBeInTheDocument();
      expect(screen.getByText("Headlight")).toBeInTheDocument();
      expect(screen.getByText("$450.00")).toBeInTheDocument();
    });
  });
});
