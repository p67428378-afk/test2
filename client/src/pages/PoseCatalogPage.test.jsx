import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import PoseCatalogPage from "./PoseCatalogPage";

vi.mock("../services/api", () => ({
  poseService: {
    getPoses: vi.fn().mockResolvedValue([
      {
        id: "pose-1",
        english_name: "Downward-Facing Dog",
        sanskrit_name: "Adho Mukha Svanasana",
        category: "Inversion",
        difficulty: "Beginner",
        alignment_cues: "Spread fingers wide",
        target_muscles: "Hamstrings, Shoulders",
        is_favorite: false,
      },
    ]),
    getFavorites: vi.fn().mockResolvedValue([]),
    addFavorite: vi.fn().mockResolvedValue({ message: "Added" }),
    removeFavorite: vi.fn().mockResolvedValue({ message: "Removed" }),
  },
}));

describe("PoseCatalogPage", () => {
  it("renders header title and search inputs", async () => {
    render(
      <BrowserRouter>
        <PoseCatalogPage />
      </BrowserRouter>,
    );

    expect(
      screen.getByText(/Yoga Pose Dictionary & Asana Library/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Search by English or Sanskrit name/i),
    ).toBeInTheDocument();
  });
});
