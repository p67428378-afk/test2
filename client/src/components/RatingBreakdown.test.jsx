import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import RatingBreakdown from "./RatingBreakdown";

describe("RatingBreakdown Component", () => {
  it("renders rating distribution and statistics cleanly", () => {
    const mockBreakdown = {
      "5_star": 10,
      "4_star": 5,
      "3_star": 2,
      "2_star": 1,
      "1_star": 0,
    };

    render(
      <RatingBreakdown
        ratingBreakdown={mockBreakdown}
        totalReviews={18}
        averageRating={4.3}
      />,
    );

    expect(screen.getByText(/Rating Distribution/i)).toBeInTheDocument();
    expect(screen.getByText(/Based on 18 reviews/i)).toBeInTheDocument();
    expect(screen.getByText("4.3")).toBeInTheDocument();
  });

  it("handles empty / zero review state gracefully", () => {
    render(
      <RatingBreakdown
        ratingBreakdown={{}}
        totalReviews={0}
        averageRating={0}
      />,
    );

    expect(screen.getByText(/Based on 0 reviews/i)).toBeInTheDocument();
    expect(screen.getByText("0.0")).toBeInTheDocument();
  });
});
