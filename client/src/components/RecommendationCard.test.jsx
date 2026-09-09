import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RecommendationCard from "./RecommendationCard";
import { api } from "../services/api";

vi.mock("../services/api", () => ({
  api: {
    submitFeedback: vi.fn(),
  },
}));

describe("RecommendationCard Component", () => {
  const mockRecommendation = {
    recommendation_id: "rec-001",
    product: {
      id: "prod-001",
      name: "Smart Fitness Tracker Pro",
      category: "Wearables",
      description: "Heart rate and sleep tracking.",
      price: 89.99,
      rating: 4.7,
      tags: ["fitness", "smart"],
    },
    match_score: 0.942,
    recommendation_type: "ai_vector",
  };

  it("renders recommendation data and match percentage", () => {
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        userId="user-123"
      />,
    );

    expect(screen.getByText("Smart Fitness Tracker Pro")).toBeInTheDocument();
    expect(screen.getByText("94.2% Match")).toBeInTheDocument();
    expect(screen.getByText("$89.99")).toBeInTheDocument();
  });

  it("submits like feedback on click", async () => {
    api.submitFeedback.mockResolvedValueOnce({
      id: "fb-1",
      recommendation_id: "rec-001",
      feedback: "like",
      status: "updated",
    });

    const onFeedback = vi.fn();
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        userId="user-123"
        onFeedbackSubmitted={onFeedback}
      />,
    );

    const likeButton = screen.getByTitle("Like this recommendation");
    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(api.submitFeedback).toHaveBeenCalledWith({
        recommendation_id: "rec-001",
        user_id: "user-123",
        feedback: "like",
      });
    });

    expect(await screen.findByText("Liked")).toBeInTheDocument();
    expect(onFeedback).toHaveBeenCalledWith("rec-001", "like");
  });
});
