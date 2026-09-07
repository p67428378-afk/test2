import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FeedbackSubmissionForm from "../FeedbackSubmissionForm";
import * as api from "../../services/api";

vi.mock("../../services/api", () => ({
  submitFeedback: vi.fn(),
}));

describe("FeedbackSubmissionForm Component", () => {
  it("renders submission form elements correctly", () => {
    render(<FeedbackSubmissionForm />);
    expect(screen.getByText(/Share Your Experience/i)).toBeInTheDocument();
    expect(screen.getByText(/Overall Rating/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Tell us about what you liked/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Submit Feedback/i }),
    ).toBeInTheDocument();
  });

  it("shows error when submitting without rating", async () => {
    render(<FeedbackSubmissionForm />);
    const submitBtn = screen.getByRole("button", { name: /Submit Feedback/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("submits feedback successfully when valid data is provided", async () => {
    const mockResponse = {
      id: "fb_12345",
      rating: 5,
      feedback_text: "Great platform experience!",
      status: "INGESTED",
    };
    vi.mocked(api.submitFeedback).mockResolvedValueOnce(mockResponse);

    render(<FeedbackSubmissionForm />);

    // Select 5-star rating
    const starBtns = screen.getAllByRole("button", { name: /Rate 5 stars/i });
    fireEvent.click(starBtns[0]);

    // Fill feedback text
    const textarea = screen.getByPlaceholderText(
      /Tell us about what you liked/i,
    );
    fireEvent.change(textarea, {
      target: { value: "Great platform experience!" },
    });

    // Submit form
    const submitBtn = screen.getByRole("button", { name: /Submit Feedback/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/Thank You for Your Feedback!/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/fb_12345/i)).toBeInTheDocument();
    });
  });
});
