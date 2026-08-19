import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

vi.mock("./services/api", () => ({
  authAPI: {
    getMe: vi.fn().mockRejectedValue(new Error("Unauthenticated")),
    login: vi.fn(),
    logout: vi.fn(),
  },
  tasksAPI: {
    listTasks: vi.fn().mockResolvedValue([]),
  },
  categoriesAPI: {
    listCategories: vi.fn().mockResolvedValue([]),
  },
  usersAPI: {
    listUsers: vi.fn().mockResolvedValue([]),
  },
  costsAPI: {
    getSummary: vi.fn().mockResolvedValue({
      total_estimated: 0,
      total_actual: 0,
      variance: 0,
      category_breakdown: [],
    }),
  },
}));

describe("App Component", () => {
  it("renders application navigation and brand header without crashing", async () => {
    render(<App />);
    const brandElement = await screen.findByText(/HomeKeep/i);
    expect(brandElement).toBeInTheDocument();
  });
});
