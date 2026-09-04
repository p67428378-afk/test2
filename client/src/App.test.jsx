import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock API calls to prevent network errors in test environment
vi.mock("./services/api", () => ({
  getSubjects: vi.fn().mockResolvedValue([
    {
      id: "sub-1",
      title: "Data Structures",
      description: "Core CS subject",
      target_exam_date: "2026-12-01T00:00:00Z",
      total_topics: 5,
      completed_topics: 2,
      progress_percentage: 40,
      topics: [],
    },
  ]),
  getAIRecommendations: vi.fn().mockResolvedValue({
    recommendations: [
      {
        topic_id: "top-1",
        topic_title: "Binary Trees",
        subject_title: "Data Structures",
        difficulty: "Hard",
        estimated_minutes: 60,
        priority_score: 9.5,
        recommendation_reason: "High difficulty and pending exam date.",
      },
    ],
  }),
  getSchedules: vi.fn().mockResolvedValue([]),
  getDailyGoal: vi.fn().mockResolvedValue(null),
  getStudyLogs: vi.fn().mockResolvedValue([]),
}));

describe("StudyPlanner Frontend App", () => {
  it("renders navbar logo and title without crashing", async () => {
    render(<App />);
    const logoElement = await screen.findByText(/StudyPlanner/i);
    expect(logoElement).toBeInTheDocument();
  });

  it("renders main dashboard navigation links", () => {
    render(<App />);
    expect(
      screen.getByRole("link", { name: /Dashboard/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Subjects & Topics/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Study Schedule/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Analytics/i }),
    ).toBeInTheDocument();
  });
});
