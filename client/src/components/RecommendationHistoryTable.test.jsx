import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RecommendationHistoryTable from "./RecommendationHistoryTable";
import { api } from "../services/api";

vi.mock("../services/api", () => ({
  api: {
    getRecommendationHistory: vi.fn(),
  },
}));

describe("RecommendationHistoryTable Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockHistoryResponse = {
    sessions: [
      {
        session_id: "sess-9912",
        timestamp: "2026-01-15T14:32:00Z",
        total_recommendations: 2,
        items: [
          {
            recommendation_id: "rec-1",
            product_name: "Smart Watch Elite",
            match_score: 0.95,
            feedback: "like",
          },
          {
            recommendation_id: "rec-2",
            product_name: "Bluetooth Speaker",
            match_score: 0.88,
            feedback: "dislike",
          },
        ],
      },
    ],
    total: 1,
    skip: 0,
    limit: 10,
  };

  it("renders historic recommendation session rows", async () => {
    api.getRecommendationHistory.mockResolvedValueOnce(mockHistoryResponse);

    render(<RecommendationHistoryTable userId="user-123" />);

    await waitFor(() => {
      expect(screen.getByText("sess-9912")).toBeInTheDocument();
    });

    expect(screen.getByText(/1 Like, 1 Dislike/i)).toBeInTheDocument();
  });

  it("expands session details when View is clicked", async () => {
    api.getRecommendationHistory.mockResolvedValueOnce(mockHistoryResponse);

    render(<RecommendationHistoryTable userId="user-123" />);

    await waitFor(() => {
      expect(screen.getByText("sess-9912")).toBeInTheDocument();
    });

    const viewBtn = screen.getByText("View");
    fireEvent.click(viewBtn);

    expect(
      screen.getByText("Recommended Items in this Session"),
    ).toBeInTheDocument();
    expect(screen.getByText("Smart Watch Elite")).toBeInTheDocument();
    expect(screen.getByText("Bluetooth Speaker")).toBeInTheDocument();
  });
});
