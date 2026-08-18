import React, { useState, useEffect } from "react";
import RecipeFilter from "../components/recipes/RecipeFilter";
import RecipeCard from "../components/recipes/RecipeCard";
import {
  recipeService,
  categoryService,
  favoriteService,
} from "../services/api";
import { Utensils, AlertCircle, Loader2 } from "lucide-react";

export default function ExplorePage({ currentUser, onOpenAuthModal }) {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchRecipes(filters);
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const fetchRecipes = async (filterParams) => {
    setLoading(true);
    setError("");
    try {
      const data = await recipeService.getRecipes(filterParams);
      setRecipes(data || []);
    } catch (err) {
      setError("Failed to load recipes. Please check API connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (recipeId, currentlyFavorite) => {
    if (!currentUser) {
      onOpenAuthModal && onOpenAuthModal();
      return;
    }
    try {
      if (currentlyFavorite) {
        await favoriteService.removeFavorite(currentUser.id, recipeId);
      } else {
        await favoriteService.addFavorite(currentUser.id, recipeId);
      }
      // Refresh list to update favorite status
      fetchRecipes(filters);
    } catch (err) {
      console.error("Favorite toggle failed:", err);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await recipeService.deleteRecipe(recipeId);
      fetchRecipes(filters);
    } catch (err) {
      alert("Failed to delete recipe.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#e05929] to-[#f97316] rounded-2xl p-6 sm:p-8 text-white shadow-md">
        <div className="max-w-2xl space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Discover & Organize Culinary Delights
          </h1>
          <p className="text-orange-100 text-sm sm:text-base">
            Search recipes by pantry ingredients, dietary tags, cook times, and
            categories.
          </p>
        </div>
      </div>

      {/* Filter Component */}
      <RecipeFilter
        categories={categories}
        onFilterChange={(newFilters) => setFilters(newFilters)}
        currentFilters={filters}
      />

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-[#e05929]" />
          <p className="text-sm font-medium">Loading delicious recipes...</p>
        </div>
      ) : recipes.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-[#e3e8f0] rounded-xl p-12 text-center max-w-lg mx-auto space-y-3">
          <div className="w-12 h-12 bg-[#e05929]/10 rounded-full flex items-center justify-center mx-auto text-[#e05929]">
            <Utensils className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">No Recipes Found</h3>
          <p className="text-sm text-gray-500">
            No recipes matched your search filters. Try clearing some criteria
            or add a new recipe!
          </p>
        </div>
      ) : (
        /* Recipe Cards Grid (2x3 responsive) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              currentUserId={currentUser?.id}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDeleteRecipe}
            />
          ))}
        </div>
      )}
    </div>
  );
}
