import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import Header from "./Header.jsx";

describe("Header Component", () => {
  it("renders brand name and navigation links", () => {
    render(<Header onSubmitPlan={vi.fn()} />);
    expect(screen.getByText("Dollar General")).toBeInTheDocument();
    expect(screen.getByText("Cluster Assortment Advisor")).toBeInTheDocument();
  });

  it("calls onSubmitPlan when Submit Plan button is clicked", () => {
    const handleSubmit = vi.fn();
    render(<Header onSubmitPlan={handleSubmit} />);
    const button = screen.getByRole("button", { name: /Submit Plan/i });
    fireEvent.click(button);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
