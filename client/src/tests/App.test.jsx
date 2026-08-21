import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "../App.jsx";

// Mock API service methods
vi.mock("../services/api.js", () => ({
  default: {},
  setAuthEmail: vi.fn(),
  getProfile: vi.fn().mockResolvedValue({
    id: "user-1",
    full_name: "Test User",
    email: "test@example.com",
    teach_skills: [],
    learn_skills: [],
  }),
  getMatches: vi.fn().mockResolvedValue([]),
  getExchangeRequests: vi.fn().mockResolvedValue([]),
  addSkill: vi.fn(),
  removeSkill: vi.fn(),
  createExchangeRequest: vi.fn(),
  updateExchangeStatus: vi.fn(),
}));

describe("App component", () => {
  it("renders navigation bar and profile page without crashing", async () => {
    render(<App />);
    expect(await screen.findByText(/SkillExchange/i)).toBeInTheDocument();
  });
});
