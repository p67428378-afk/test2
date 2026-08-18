import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RecipeCard from "./RecipeCard";
import { describe, it, expect, vi } from "vitest";

describe("RecipeCard", () => {
  const mockRecipe = {
    id: "rec-123",
    title: "Garlic Butter Shrimp",
    description: "Delicious quick garlic butter shrimp with herbs.",
    prep_time: 10,
    cook_time: 15,
    servings: 2,
    category_name: "Seafood",
    dietary_tags: ["Keto", "Gluten-Free"],
    is_favorite: false,
    user_id: "user-1",
  };

  it("renders recipe title, category, and times", () => {
    render(
      <BrowserRouter>
        <RecipeCard recipe={mockRecipe} />
      </BrowserRouter>,
    );

    expect(screen.getByText("Garlic Butter Shrimp")).toBeInTheDocument();
    expect(screen.getByText("Seafood")).toBeInTheDocument();
    expect(screen.getByText("25 mins")).toBeInTheDocument();
    expect(screen.getByText("2 serv")).toBeInTheDocument();
    expect(screen.getByText("Keto")).toBeInTheDocument();
    expect(screen.getByText("Gluten-Free")).toBeInTheDocument();
  });
});
