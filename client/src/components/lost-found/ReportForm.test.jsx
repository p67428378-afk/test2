import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ReportForm from "./ReportForm";

describe("ReportForm Component", () => {
  it("renders form fields correctly", () => {
    render(
      <ReportForm
        onSubmit={vi.fn()}
        isLoading={false}
        error={null}
        success={false}
      />,
    );
    expect(screen.getByText(/Report Lost or Found Item/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Color/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Brand/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Seen Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of Loss\/Found/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  });

  it("calls onSubmit with form data when submitted", () => {
    const handleSubmit = vi.fn();
    render(
      <ReportForm
        onSubmit={handleSubmit}
        isLoading={false}
        error={null}
        success={false}
      />,
    );

    fireEvent.change(screen.getByLabelText(/Color/i), {
      target: { value: "Red" },
    });
    fireEvent.change(screen.getByLabelText(/Brand/i), {
      target: { value: "Sony" },
    });
    fireEvent.change(screen.getByLabelText(/Last Seen Location/i), {
      target: { value: "Room 101" },
    });
    fireEvent.change(screen.getByLabelText(/Date of Loss\/Found/i), {
      target: { value: "2026-05-25" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "My headphones" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Submit Report/i }));

    expect(handleSubmit).toHaveBeenCalledWith({
      item_type: "lost",
      category: "Electronics",
      color: "Red",
      brand: "Sony",
      description: "My headphones",
      location: "Room 101",
      item_date: "2026-05-25",
      image_urls: [],
    });
  });
});
