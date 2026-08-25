import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import WatchlistItem from "./WatchlistItem";

describe("WatchlistItem Component", () => {
  const mockEntry = {
    id: "w1",
    film: {
      id: "1",
      title: "Inception",
      release_year: 2010,
      genre: "Sci-Fi/Action",
      poster_url: "https://example.com/inception.jpg",
    },
  };

  it("renders watchlist item details correctly", () => {
    render(
      <WatchlistItem
        entry={mockEntry}
        currentRating={0}
        onRemove={vi.fn()}
        onRate={vi.fn()}
        onClearRating={vi.fn()}
      />,
    );

    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("(2010)")).toBeInTheDocument();
    expect(screen.getByText("Sci-Fi/Action")).toBeInTheDocument();
    expect(screen.getByText("Rate Movie")).toBeInTheDocument();
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });
});
