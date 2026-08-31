import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ReviewForm from "./ReviewForm";

describe("ReviewForm Component", () => {
  it("renders form elements properly", () => {
    render(<ReviewForm />);

    expect(
      screen.getByLabelText(/Booking Reservation ID/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Submit Feedback/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Share your thoughts/i),
    ).toBeInTheDocument();
  });
});
