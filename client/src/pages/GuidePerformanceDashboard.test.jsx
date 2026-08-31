import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import GuidePerformanceDashboard from "./GuidePerformanceDashboard";

describe("GuidePerformanceDashboard Component", () => {
  it("renders page header and metric sections", () => {
    render(
      <BrowserRouter>
        <GuidePerformanceDashboard />
      </BrowserRouter>,
    );

    expect(
      screen.getByText(/Feedback Summaries & Guide Performance Metrics/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Total Reviews Collected/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Tour Route Feedback Summaries/i),
    ).toBeInTheDocument();
  });
});
