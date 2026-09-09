import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import RecommendationToolbar from "./RecommendationToolbar";

describe("RecommendationToolbar Component", () => {
  it("renders toolbar controls with initial values", () => {
    render(
      <BrowserRouter>
        <RecommendationToolbar
          activeUserId="user-123"
          limit={6}
          minRating="4.0"
          sortBy="match_score"
          sortOrder="desc"
          resultCount={5}
          avgScore={92.5}
        />
      </BrowserRouter>,
    );

    expect(screen.getByLabelText(/User ID:/i)).toHaveValue("user-123");
    expect(screen.getByLabelText(/Min Rating:/i)).toHaveValue("4.0");
    expect(screen.getByLabelText(/Sort By:/i)).toHaveValue("match_score");
    expect(screen.getByText("5 Recommendations Found")).toBeInTheDocument();
  });

  it("triggers filter callbacks when dropdowns change", () => {
    const onMinRatingChange = vi.fn();
    const onSortByChange = vi.fn();
    const onRefresh = vi.fn();

    render(
      <BrowserRouter>
        <RecommendationToolbar
          activeUserId="user-123"
          limit={6}
          minRating=""
          onMinRatingChange={onMinRatingChange}
          sortBy="match_score"
          onSortByChange={onSortByChange}
          onRefresh={onRefresh}
        />
      </BrowserRouter>,
    );

    const minRatingSelect = screen.getByLabelText(/Min Rating:/i);
    fireEvent.change(minRatingSelect, { target: { value: "3.5" } });
    expect(onMinRatingChange).toHaveBeenCalledWith("3.5");

    const sortBySelect = screen.getByLabelText(/Sort By:/i);
    fireEvent.change(sortBySelect, { target: { value: "price" } });
    expect(onSortByChange).toHaveBeenCalledWith("price");

    const refreshButton = screen.getByText("Refresh Picks");
    fireEvent.click(refreshButton);
    expect(onRefresh).toHaveBeenCalled();
  });
});
