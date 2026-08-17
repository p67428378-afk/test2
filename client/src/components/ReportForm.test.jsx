import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ReportForm from "./lost-found/ReportForm";

describe("ReportForm", () => {
  it("renders form inputs and handles report type toggle", () => {
    const handleSubmit = vi.fn();
    render(<ReportForm onSubmit={handleSubmit} />);

    expect(screen.getByLabelText(/Item Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Detailed Description/i)).toBeInTheDocument();

    const lostBtn = screen.getByRole("button", { name: /I Lost an Item/i });
    const foundBtn = screen.getByRole("button", { name: /I Found an Item/i });

    expect(lostBtn).toBeInTheDocument();
    expect(foundBtn).toBeInTheDocument();
  });

  it("validates required fields on submission", async () => {
    const handleSubmit = vi.fn();
    render(<ReportForm onSubmit={handleSubmit} />);

    const submitBtn = screen.getByRole("button", {
      name: /Submit Item Report/i,
    });
    fireEvent.click(submitBtn);

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/Item name is required/i)).toBeInTheDocument();
  });
});
