import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ApplyLeaveForm from "./ApplyLeaveForm";

describe("ApplyLeaveForm", () => {
  it("renders apply leave form correctly", () => {
    render(<ApplyLeaveForm onSubmit={vi.fn()} isSubmitting={false} />);

    expect(screen.getByText("Apply for Leave")).toBeInTheDocument();
    expect(screen.getByLabelText("Leave Type")).toBeInTheDocument();
    expect(screen.getByLabelText("Start Date")).toBeInTheDocument();
    expect(screen.getByLabelText("End Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Reason")).toBeInTheDocument();
  });

  it("shows error when fields are missing", () => {
    render(<ApplyLeaveForm onSubmit={vi.fn()} isSubmitting={false} />);

    const submitButton = screen.getByRole("button", {
      name: /Submit Request/i,
    });
    fireEvent.click(submitButton);

    expect(screen.getByText("All fields are required.")).toBeInTheDocument();
  });
});
