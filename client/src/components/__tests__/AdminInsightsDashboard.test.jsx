import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminInsightsDashboard from "../AdminInsightsDashboard";
import * as api from "../../services/api";

vi.mock("../../services/api", () => ({
  getAdminInsights: vi.fn(),
  listAdminFeedback: vi.fn(),
  listAdminAlerts: vi.fn(),
  exportAdminCsv: vi.fn(),
}));

describe("AdminInsightsDashboard Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders dashboard heading and loads metrics", async () => {
    vi.mocked(api.getAdminInsights).mockResolvedValueOnce({
      total_feedback: 1284,
      avg_rating: 4.2,
      sentiment_distribution: {
        positive: 873,
        neutral: 231,
        negative: 180,
        positive_percentage: 68.0,
        neutral_percentage: 18.0,
        negative_percentage: 14.0,
      },
      top_topics: [
        {
          name: "UI Usability",
          count: 342,
          percentage: 38,
          sentiment: "Positive",
        },
      ],
      historical_trends: [],
    });

    vi.mocked(api.listAdminFeedback).mockResolvedValueOnce({
      items: [
        {
          id: "fb_10293847",
          rating: 5,
          feedback_text: "Awesome dashboard UI",
          customer_email: "user@example.com",
          category: "UI Usability",
          status: "ANALYZED",
          created_at: "2026-05-18T10:00:00Z",
          sentiment: { sentiment: "POSITIVE", confidence_score: 0.95 },
        },
      ],
      total: 1,
      skip: 0,
      limit: 10,
    });

    vi.mocked(api.listAdminAlerts).mockResolvedValueOnce([]);

    render(<AdminInsightsDashboard />);

    expect(screen.getByText(/Customer Feedback Insights/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/1,284/i)).toBeInTheDocument();
      expect(screen.getByText(/4.2 \/ 5.0/i)).toBeInTheDocument();
      expect(screen.getByText(/Awesome dashboard UI/i)).toBeInTheDocument();
    });
  });
});
