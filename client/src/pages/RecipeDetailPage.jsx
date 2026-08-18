import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { recipeService, favoriteService } from "../services/api";
import {
  ArrowLeft,
  Clock,
  Users,
  Heart,
  Edit3,
  Trash2,
  CheckSquare,
  Square,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function RecipeDetailPage({ currentUser, onOpenAuthModal }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkedIngredients, setCheckedIngredients] = useState({});

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await recipeService.getRecipe(id);
      setRecipe(data);
    } catch (err) {
      setError("Recipe not found or failed to load.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      onOpenAuthModal && onOpenAuthModal();
      return;
    }
    try {
      if (recipe.is_favorite) {
        await favoriteService.removeFavorite(currentUser.id, recipe.id);
        setRecipe({ ...recipe, is_favorite: false });
      } else {
        await favoriteService.addFavorite(currentUser.id, recipe.id);
        setRecipe({ ...recipe, is_favorite: true });
      }
    } catch (err) {
      console.error("Favorite toggle failed:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await recipeService.deleteRecipe(id);
      navigate("/");
    } catch (err) {
      alert("Failed to delete recipe.");
    }
  };

  const toggleIngredientCheck = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-[#e05929]" />
        <p className="text-sm font-medium">Loading recipe details...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl text-center space-y-3 max-w-md mx-auto my-12">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
        <h3 className="font-bold text-lg">{error || "Recipe not found"}</h3>
        <Link
          to="/"
          className="inline-block bg-[#e05929] text-white text-sm px-4 py-2 rounded-lg font-medium"
        >
          ← Back to Recipes
        </Link>
      </div>
    );
  }

  const isOwner = currentUser && recipe.user_id === currentUser.id;
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e05929] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Recipes
      </Link>

      {/* Main Recipe Card */}
      <div className="bg-white border border-[#e3e8f0] rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="space-y-1">
            <span className="bg-[#e05929]/10 text-[#e05929] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              {recipe.category?.name || "General"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171c29]">
              {recipe.title}
            </h1>
            {recipe.description && (
              <p className="text-gray-600 text-sm">{recipe.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={handleToggleFavorite}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-xs font-medium transition"
            >
              <Heart
                className={`w-4 h-4 ${
                  recipe.is_favorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span>{recipe.is_favorite ? "Saved" : "Favorite"}</span>
            </button>

            {isOwner && (
              <>
                <Link
                  to={`/recipes/${recipe.id}/edit`}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-medium transition"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Link>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-xs font-medium transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Dietary Badges */}
        {recipe.dietary_tags && recipe.dietary_tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {recipe.dietary_tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stat Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#f7fafc] p-4 rounded-xl text-center border border-[#e3e8f0]">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Prep Time
            </p>
            <p className="text-base font-bold text-gray-800 mt-0.5">
              {recipe.prep_time} mins
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Cook Time
            </p>
            <p className="text-base font-bold text-gray-800 mt-0.5">
              {recipe.cook_time} mins
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Total Time
            </p>
            <p className="text-base font-bold text-[#e05929] mt-0.5">
              {totalTime} mins
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Servings
            </p>
            <p className="text-base font-bold text-gray-800 mt-0.5">
              {recipe.servings} Servings
            </p>
          </div>
        </div>

        {/* 2-Column Layout: Ingredients & Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {/* Ingredients Column */}
          <div className="md:col-span-1 space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-800 text-base border-b pb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#e05929]" />
              Ingredients
            </h3>
            {!recipe.ingredients || recipe.ingredients.length === 0 ? (
              <p className="text-xs text-gray-400 italic">
                No ingredients listed.
              </p>
            ) : (
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, idx) => {
                  const isChecked = checkedIngredients[idx];
                  return (
                    <li
                      key={idx}
                      onClick={() => toggleIngredientCheck(idx)}
                      className={`flex items-start gap-2 text-sm cursor-pointer select-none p-1.5 rounded hover:bg-gray-100 transition ${
                        isChecked
                          ? "line-through text-gray-400"
                          : "text-gray-700"
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-[#e05929] shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      )}
                      <span>
                        <strong className="font-semibold text-gray-900">
                          {ing.quantity} {ing.unit}
                        </strong>{" "}
                        {ing.name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Instructions Column */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-bold text-gray-800 text-base border-b pb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#e05929]" />
              Step-by-Step Instructions
            </h3>
            <div className="prose prose-sm text-gray-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-gray-100">
              {recipe.instructions}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
