import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PodcastCard from "./PodcastCard";

describe("PodcastCard Component", () => {
  const mockPodcast = {
    id: "test-uuid-1234",
    title: "Tech Pulse Daily",
    author: "Jane Developer",
    description:
      "A deep dive into AI, software architecture, and cloud platforms.",
    cover_image_url: "https://example.com/cover.jpg",
    category: "Technology",
    total_subscribers: 14200,
  };

  it("renders podcast card with correct metadata and labels", () => {
    render(
      <BrowserRouter>
        <PodcastCard podcast={mockPodcast} />
      </BrowserRouter>,
    );

    expect(screen.getByText("Tech Pulse Daily")).toBeInTheDocument();
    expect(screen.getByText("By Jane Developer")).toBeInTheDocument();
    expect(screen.getByText("Technology")).toBeInTheDocument();
    expect(screen.getByText("14.2k subscribers")).toBeInTheDocument();
    expect(screen.getByText(/View Episodes/)).toBeInTheDocument();
  });

  it("returns null gracefully when podcast prop is missing", () => {
    const { container } = render(
      <BrowserRouter>
        <PodcastCard podcast={null} />
      </BrowserRouter>,
    );
    expect(container.firstChild).toBeNull();
  });
});
