import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CategoryOverrideModal from "./CategoryOverrideModal";

const mockEmail = {
  id: "test-uuid-1234",
  sender: "alert@company.com",
  subject: "Test Email Subject",
  body_text: "This is a test email body for classification inspection.",
  source_type: "TEXT_ENTRY",
  created_at: "2026-09-10T12:00:00Z",
  classification: {
    primary_category: "Work",
    ai_category: "Work",
    confidence_score: 92.5,
    user_override_category: null,
    is_overridden: false,
  },
};

describe("CategoryOverrideModal Component", () => {
  it("does not render when isOpen is false", () => {
    render(
      <CategoryOverrideModal
        email={mockEmail}
        isOpen={false}
        onClose={vi.fn()}
        onUpdated={vi.fn()}
      />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders modal content and email details when open", () => {
    render(
      <CategoryOverrideModal
        email={mockEmail}
        isOpen={true}
        onClose={vi.fn()}
        onUpdated={vi.fn()}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Email Subject")).toBeInTheDocument();
    expect(screen.getByText("alert@company.com")).toBeInTheDocument();
    expect(screen.getByText("92.5% Confidence")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <CategoryOverrideModal
        email={mockEmail}
        isOpen={true}
        onClose={handleClose}
        onUpdated={vi.fn()}
      />,
    );

    const closeBtn = screen.getByLabelText("Close modal");
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });
});
