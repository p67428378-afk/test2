import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LaptopForm from "./LaptopForm";

describe("LaptopForm Component", () => {
  it("renders form fields correctly", () => {
    render(<LaptopForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByLabelText("Brand")).toBeInTheDocument();
    expect(screen.getByLabelText("Model")).toBeInTheDocument();
    expect(screen.getByLabelText("Price ($)")).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", () => {
    render(<LaptopForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /Add Laptop/i }));
    expect(screen.getByText("Brand is required")).toBeInTheDocument();
    expect(screen.getByText("Model is required")).toBeInTheDocument();
  });
});
