import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RecipeFormPage from "./RecipeFormPage";
import { describe, it, expect, vi } from "vitest";

vi.mock("../services/api", () => ({
  categoryService: {
    getCategories: vi.fn().mockResolvedValue([{ id: "c1", name: "Italian" }]),
  },
  recipeService: {
    getRecipe: vi.fn(),
    createRecipe: vi.fn(),
    updateRecipe: vi.fn(),
  },
}));

describe("RecipeFormPage", () => {
  it("renders recipe creation form headings and inputs", async () => {
    render(
      <BrowserRouter>
        <RecipeFormPage currentUser={{ id: "u1", email: "test@example.com" }} />
      </BrowserRouter>,
    );

    expect(await screen.findByText("Create New Recipe")).toBeInTheDocument();
    expect(screen.getByText("1. Basic Information")).toBeInTheDocument();
    expect(screen.getByText("2. Ingredients Required")).toBeInTheDocument();
  });
});
