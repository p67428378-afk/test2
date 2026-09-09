import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RecommendationsPage from "./RecommendationsPage";
import { api } from "../services/api";

vi.mock("../services/api", () => ({
  api: {
    generateRecommendations: vi.fn(),
    submitFeedback: vi.fn(),
  },
}));

describe("RecommendationsPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders recommendation items from api", async () => {
    api.generateRecommendations.mockResolvedValueOnce({
      user_id: "user-123",
      recommendations: [
        {
          recommendation_id: "rec-123",
          product: {
            id: "p-123",
            name: "Gaming Mechanical Keyboard",
            category: "Computers",
            price: 129.99,
            rating: 4.9,
            tags: ["rgb", "mechanical"],
            description: "Custom switch mechanical keyboard.",
          },
          match_score: 0.985,
          recommendation_type: "ai_vector",
        },
      ],
    });

    render(
      <BrowserRouter>
        <RecommendationsPage userId="user-123" onAddToCart={vi.fn()} />
      </BrowserRouter>,
    );

    expect(
      screen.getByText("AI Personalized Picks for You"),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("Gaming Mechanical Keyboard"),
      ).toBeInTheDocument();
      expect(screen.getByText("98.5% Match")).toBeInTheDocument();
    });
  });
});
