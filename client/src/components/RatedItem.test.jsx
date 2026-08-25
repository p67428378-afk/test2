import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RatedItem from "./RatedItem";

describe("RatedItem Component", () => {
  const mockEntry = {
    id: "r1",
    rating: 5,
    film: {
      id: "1",
      title: "Interstellar",
      release_year: 2014,
      genre: "Sci-Fi/Drama",
      poster_url: "https://example.com/interstellar.jpg",
    },
  };

  it("renders rated item details correctly", () => {
    render(
      <RatedItem entry={mockEntry} onClearRating={vi.fn()} onRate={vi.fn()} />,
    );

    expect(screen.getByText("Interstellar")).toBeInTheDocument();
    expect(screen.getByText("(2014)")).toBeInTheDocument();
    expect(screen.getByText("Sci-Fi/Drama")).toBeInTheDocument();
    expect(screen.getByText("5/5")).toBeInTheDocument();
  });
});
