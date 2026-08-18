import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import FavoritesPage from "./FavoritesPage";
import { describe, it, expect, vi } from "vitest";

vi.mock("../services/api", () => ({
  recipeService: {
    getRecipes: vi.fn().mockResolvedValue([
      {
        id: "r1",
        title: "Favorite Taco",
        category_name: "Mexican",
        prep_time: 10,
        cook_time: 10,
        servings: 2,
        is_favorite: true,
        user_id: "u1",
      },
    ]),
  },
  favoriteService: {
    removeFavorite: vi.fn(),
  },
}));

describe("FavoritesPage", () => {
  it("renders collection stats and favorites list for logged in user", async () => {
    render(
      <BrowserRouter>
        <FavoritesPage currentUser={{ id: "u1", email: "test@example.com" }} />
      </BrowserRouter>,
    );

    expect(await screen.findByText("My Saved Collections")).toBeInTheDocument();
    expect(await screen.findByText("Favorite Taco")).toBeInTheDocument();
  });
});
