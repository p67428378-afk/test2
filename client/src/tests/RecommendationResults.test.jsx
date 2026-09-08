import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RecommendationResults from "../components/RecommendationResults";
import BudgetSummaryCard from "../components/BudgetSummaryCard";

const mockRecommendation = {
  request_id: "req-123",
  id: "rec-456",
  destination: "Tokyo, Japan",
  budget: 150.0,
  currency: "USD",
  is_fallback: false,
  items: [
    {
      id: "1",
      title: "Senso-ji Temple",
      category: "Temples & Culture",
      estimated_cost: 0,
      location: "Asakusa, Tokyo",
      duration: "2 hours",
      description: "Ancient Buddhist temple",
    },
    {
      id: "2",
      title: "Omoide Yokocho",
      category: "Food & Dining",
      estimated_cost: 25.0,
      location: "Shinjuku, Tokyo",
      duration: "1.5 hours",
      description: "Dining alleyway",
    },
  ],
};

describe("RecommendationResults", () => {
  it("renders destination header and item titles", () => {
    render(<RecommendationResults recommendation={mockRecommendation} />);

    expect(
      screen.getByText(/Personalized Itinerary for Tokyo, Japan/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Senso-ji Temple")).toBeInTheDocument();
    expect(screen.getByText("Omoide Yokocho")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Export Itinerary/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Share Link/i }),
    ).toBeInTheDocument();
  });

  it("opens export modal when export button is clicked", () => {
    render(<RecommendationResults recommendation={mockRecommendation} />);

    const exportBtn = screen.getByRole("button", { name: /Export Itinerary/i });
    fireEvent.click(exportBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("filters items when category tab is clicked", () => {
    render(<RecommendationResults recommendation={mockRecommendation} />);

    const foodTab = screen.getByRole("button", { name: "Food & Dining" });
    fireEvent.click(foodTab);

    expect(screen.getByText("Omoide Yokocho")).toBeInTheDocument();
    expect(screen.queryByText("Senso-ji Temple")).not.toBeInTheDocument();
  });
});

describe("BudgetSummaryCard", () => {
  it("calculates total estimated spend correctly", () => {
    render(
      <BudgetSummaryCard
        budget={mockRecommendation.budget}
        currency={mockRecommendation.currency}
        items={mockRecommendation.items}
      />,
    );

    expect(screen.getByText("$150.00 USD")).toBeInTheDocument();
    expect(screen.getByText("$25.00 USD")).toBeInTheDocument(); // $0 + $25
    expect(screen.getByText("$125.00 USD")).toBeInTheDocument(); // remaining $150 - $25
  });
});
