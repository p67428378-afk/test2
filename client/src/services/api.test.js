import { describe, it, expect, vi } from "vitest";
import {
  authService,
  recipeService,
  categoryService,
  favoriteService,
} from "./api";

describe("API Services Structural Tests", () => {
  it("exports authService with login and register functions", () => {
    expect(typeof authService.login).toBe("function");
    expect(typeof authService.register).toBe("function");
    expect(typeof authService.logout).toBe("function");
  });

  it("exports recipeService with CRUD functions", () => {
    expect(typeof recipeService.getRecipes).toBe("function");
    expect(typeof recipeService.getRecipe).toBe("function");
    expect(typeof recipeService.createRecipe).toBe("function");
    expect(typeof recipeService.updateRecipe).toBe("function");
    expect(typeof recipeService.deleteRecipe).toBe("function");
  });

  it("exports categoryService with getCategories", () => {
    expect(typeof categoryService.getCategories).toBe("function");
  });

  it("exports favoriteService with add and remove favorite functions", () => {
    expect(typeof favoriteService.addFavorite).toBe("function");
    expect(typeof favoriteService.removeFavorite).toBe("function");
  });
});
