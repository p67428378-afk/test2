import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ExportSettingsModal from "./ExportSettingsModal";

describe("ExportSettingsModal Component", () => {
  const mockDoc = {
    id: "test-uuid-1234",
    title: "Design Specification",
    content: "# Design Spec\n\n- Point 1\n- Point 2",
  };

  it("renders modal with metadata when open", () => {
    render(
      <ExportSettingsModal
        isOpen={true}
        onClose={vi.fn()}
        documentData={mockDoc}
        enableSanitization={true}
        autoSaveEnabled={true}
      />,
    );

    expect(screen.getByText("Document Export & Settings")).toBeInTheDocument();
    expect(screen.getByText("Design Specification")).toBeInTheDocument();
    expect(screen.getByText("test-uuid-1234")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Download MD/i }),
    ).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <ExportSettingsModal
        isOpen={false}
        onClose={vi.fn()}
        documentData={mockDoc}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("switches export format when clicking format buttons", () => {
    render(
      <ExportSettingsModal
        isOpen={true}
        onClose={vi.fn()}
        documentData={mockDoc}
      />,
    );

    const htmlFormatBtn = screen.getByText("HTML (.html)");
    fireEvent.click(htmlFormatBtn);

    expect(
      screen.getByRole("button", { name: /Download HTML/i }),
    ).toBeInTheDocument();
  });
});
