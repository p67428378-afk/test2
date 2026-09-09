import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import PreferencesPage from "./PreferencesPage";

vi.mock("../services/api", () => ({
  api: {
    getPreferences: vi.fn().mockResolvedValue({
      user_id: "user-123",
      category_preferences: ["Electronics"],
      min_price: 20,
      max_price: 500,
      preferred_tags: [],
    }),
    savePreferences: vi.fn(),
  },
}));

describe("PreferencesPage Component", () => {
  it("renders preference instructions and form", () => {
    render(
      <BrowserRouter>
        <PreferencesPage userId="user-123" />
      </BrowserRouter>,
    );

    expect(
      screen.getByText("Customize Your Shopping Profile"),
    ).toBeInTheDocument();
    expect(screen.getByText("1. Select Categories")).toBeInTheDocument();
    expect(screen.getByText("2. Budget Boundaries")).toBeInTheDocument();
    expect(screen.getByText("3. AI Vector Scoring")).toBeInTheDocument();
  });
});
