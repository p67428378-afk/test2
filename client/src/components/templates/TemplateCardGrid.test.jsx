// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TemplateCardGrid, { RESUME_TEMPLATES } from "./TemplateCardGrid";

describe("TemplateCardGrid Component", () => {
  it("renders all template options with descriptions", () => {
    render(
      <TemplateCardGrid
        selectedTemplate="classic"
        onSelectTemplate={() => {}}
      />,
    );

    expect(screen.getByText("Classic Template")).toBeInTheDocument();
    expect(screen.getByText("Modern Template")).toBeInTheDocument();
    expect(screen.getByText("Executive Template")).toBeInTheDocument();
    expect(screen.getByText("Minimalist Template")).toBeInTheDocument();
  });

  it("calls onSelectTemplate when a template card is clicked", () => {
    const handleSelect = vi.fn();
    render(
      <TemplateCardGrid
        selectedTemplate="classic"
        onSelectTemplate={handleSelect}
      />,
    );

    const modernCard = screen.getByText("Modern Template");
    fireEvent.click(modernCard);

    expect(handleSelect).toHaveBeenCalledWith("modern");
  });
});
