import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RecommendationForm from "../components/RecommendationForm";

describe("RecommendationForm", () => {
  it("renders form inputs and submit button", () => {
    render(<RecommendationForm onSubmit={vi.fn()} isLoading={false} />);

    expect(screen.getByLabelText(/Destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Daily Budget/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Currency/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Generate AI Recommendations/i }),
    ).toBeInTheDocument();
  });

  it("submits form with valid user inputs", () => {
    const handleSubmit = vi.fn();
    render(<RecommendationForm onSubmit={handleSubmit} isLoading={false} />);

    const destInput = screen.getByLabelText(/Destination/i);
    const budgetInput = screen.getByLabelText(/Daily Budget/i);

    fireEvent.change(destInput, { target: { value: "Kyoto, Japan" } });
    fireEvent.change(budgetInput, { target: { value: "200" } });

    const submitBtn = screen.getByRole("button", {
      name: /Generate AI Recommendations/i,
    });
    fireEvent.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        destination: "Kyoto, Japan",
        budget: 200,
        currency: "USD",
      }),
    );
  });

  it("displays validation error if destination is cleared", () => {
    const handleSubmit = vi.fn();
    render(<RecommendationForm onSubmit={handleSubmit} isLoading={false} />);

    const destInput = screen.getByLabelText(/Destination/i);
    fireEvent.change(destInput, { target: { value: "" } });

    const submitBtn = screen.getByRole("button", {
      name: /Generate AI Recommendations/i,
    });
    fireEvent.click(submitBtn);

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
