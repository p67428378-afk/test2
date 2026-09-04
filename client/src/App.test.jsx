import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import FeedbackSubmissionForm from "./components/FeedbackSubmissionForm";
import SentimentBreakdownChart from "./components/SentimentBreakdownChart";
import TopTopicsWidget from "./components/TopTopicsWidget";

describe("Customer Feedback Analyzer Frontend", () => {
  it("renders feedback submission form title and star rating buttons", () => {
    render(<FeedbackSubmissionForm onOpenAdmin={() => {}} />);
    expect(screen.getByText("Customer Feedback Hub")).toBeInTheDocument();
    expect(screen.getByText("Share Your Experience")).toBeInTheDocument();
    expect(screen.getByText("Overall Rating")).toBeInTheDocument();
    expect(screen.getByText("Submit Feedback")).toBeInTheDocument();
  });

  it("shows error if submitted without selecting a rating", () => {
    render(<FeedbackSubmissionForm onOpenAdmin={() => {}} />);
    const submitBtn = screen.getByText("Submit Feedback");
    fireEvent.click(submitBtn);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please select a star rating.",
    );
  });

  it("renders sentiment breakdown chart with percentages", () => {
    const distribution = {
      positive: 10,
      neutral: 5,
      negative: 2,
      positive_percentage: 58.8,
      neutral_percentage: 29.4,
      negative_percentage: 11.8,
    };
    render(<SentimentBreakdownChart distribution={distribution} />);
    expect(screen.getByText("Sentiment Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Positive (58.8%)")).toBeInTheDocument();
    expect(screen.getByText("10 submissions")).toBeInTheDocument();
  });

  it("renders top topics widget items", () => {
    const topics = [
      {
        name: "UI Usability",
        count: 12,
        percentage: 50,
        sentiment: "Positive",
      },
    ];
    render(<TopTopicsWidget topics={topics} />);
    expect(
      screen.getByText("Top AI Extracted Issue Categories"),
    ).toBeInTheDocument();
    expect(screen.getByText("UI Usability")).toBeInTheDocument();
    expect(screen.getByText("12 mentions")).toBeInTheDocument();
  });
});
