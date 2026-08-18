import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ExplorePage from "./ExplorePage";
import { describe, it, expect, vi } from "vitest";

vi.mock("../services/api", () => ({
  recipeService: {
    getRecipes: vi.fn().mockResolvedValue([
      {
        id: "r1",
        title: "Chicken Curry",
        category_name: "Indian",
        prep_time: 15,
        cook_time: 30,
        servings: 4,
        dietary_tags: ["Gluten-Free"],
        is_favorite: false,
      },
    ]),
  },
  categoryService: {
    getCategories: vi.fn().mockResolvedValue([{ id: "c1", name: "Indian" }]),
  },
  favoriteService: {
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  },
}));

describe("ExplorePage", () => {
  it("renders explore page title and fetched recipes", async () => {
    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>,
    );

    expect(
      await screen.findByText(/Discover & Organize Culinary Delights/i),
    ).toBeInTheDocument();
    expect(await screen.findByText("Chicken Curry")).toBeInTheDocument();
  });
});
