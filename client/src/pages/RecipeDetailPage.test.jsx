import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RecipeDetailPage from "./RecipeDetailPage";
import { describe, it, expect, vi } from "vitest";

vi.mock("../services/api", () => ({
  recipeService: {
    getRecipe: vi.fn().mockResolvedValue({
      id: "r1",
      title: "Spaghetti Carbonara",
      description: "Classic Roman pasta dish.",
      prep_time: 10,
      cook_time: 15,
      servings: 2,
      instructions: "Boil pasta. Fry guanciale. Mix eggs and cheese.",
      category: { id: "c1", name: "Italian" },
      ingredients: [{ name: "Spaghetti", quantity: "200", unit: "g" }],
      dietary_tags: [],
      is_favorite: true,
      user_id: "u1",
    }),
  },
  favoriteService: {
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  },
}));

describe("RecipeDetailPage", () => {
  it("renders recipe detail title, stats, ingredients, and instructions", async () => {
    render(
      <MemoryRouter initialEntries={["/recipes/r1"]}>
        <Routes>
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Spaghetti Carbonara")).toBeInTheDocument();
    expect(screen.getByText("Classic Roman pasta dish.")).toBeInTheDocument();
    expect(screen.getByText("Spaghetti")).toBeInTheDocument();
    expect(
      screen.getByText("Boil pasta. Fry guanciale. Mix eggs and cheese."),
    ).toBeInTheDocument();
  });
});
