import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import ReviewSubmissionPage from "./ReviewSubmissionPage";

describe("ReviewSubmissionPage Component", () => {
  it("renders page header and review form", () => {
    render(
      <BrowserRouter>
        <ReviewSubmissionPage />
      </BrowserRouter>,
    );

    expect(
      screen.getByText(/Rate Your Museum Guided Tour/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Eligibility Requirements/i)).toBeInTheDocument();
  });
});
