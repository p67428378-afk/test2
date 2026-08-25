import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FilmCard from "./FilmCard";

describe("FilmCard Component", () => {
  const mockFilm = {
    id: "1",
    title: "Inception",
    release_year: 2010,
    genre: "Sci-Fi/Action",
    poster_url: "https://example.com/inception.jpg",
  };

  it("renders film details correctly", () => {
    render(
      <FilmCard
        film={mockFilm}
        isInWatchlist={false}
        currentRating={0}
        onAddToWatchlist={vi.fn()}
        onRemoveFromWatchlist={vi.fn()}
        onRate={vi.fn()}
        onClearRating={vi.fn()}
      />,
    );

    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("(2010)")).toBeInTheDocument();
    expect(screen.getByText("Sci-Fi/Action")).toBeInTheDocument();
    expect(screen.getByText("+ Add to Watchlist")).toBeInTheDocument();
  });

  it("renders in watchlist state correctly", () => {
    render(
      <FilmCard
        film={mockFilm}
        isInWatchlist={true}
        currentRating={4}
        onAddToWatchlist={vi.fn()}
        onRemoveFromWatchlist={vi.fn()}
        onRate={vi.fn()}
        onClearRating={vi.fn()}
      />,
    );

    expect(screen.getByText("✓ In Watchlist")).toBeInTheDocument();
  });
});
