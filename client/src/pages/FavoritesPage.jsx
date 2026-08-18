import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { recipeService, favoriteService } from "../services/api";
import RecipeCard from "../components/recipes/RecipeCard";
import {
  Heart,
  BookOpen,
  Clock,
  PlusCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function FavoritesPage({ currentUser, onOpenAuthModal }) {
  const [activeTab, setActiveTab] = useState("favorites"); // 'favorites' | 'my_recipes'
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      loadCollections();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadCollections = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch favorites
      const favs = await recipeService.getRecipes({ favorites_only: true });
      setFavoriteRecipes(favs || []);

      // Fetch all recipes to filter user's created ones
      const all = await recipeService.getRecipes();
      if (currentUser) {
        const mine = (all || []).filter((r) => r.user_id === currentUser.id);
        setMyRecipes(mine);
      }
    } catch (err) {
      setError("Failed to load collections.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (recipeId, currentlyFavorite) => {
    if (!currentUser) return;
    try {
      if (currentlyFavorite) {
        await favoriteService.removeFavorite(currentUser.id, recipeId);
      } else {
        await favoriteService.addFavorite(currentUser.id, recipeId);
      }
      loadCollections();
    } catch (err) {
      console.error("Favorite toggle failed:", err);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await recipeService.deleteRecipe(recipeId);
      loadCollections();
    } catch (err) {
      alert("Failed to delete recipe.");
    }
  };

  if (!currentUser) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-2xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm my-12">
        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          Log In to View Saved Collections
        </h2>
        <p className="text-sm text-gray-500">
          Save your favorite recipes and manage your custom created dishes
          across devices.
        </p>
        <button
          onClick={onOpenAuthModal}
          className="bg-[#e05929] hover:bg-[#c8491f] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  // Calculate Collection Stats
  const displayList = activeTab === "favorites" ? favoriteRecipes : myRecipes;
  const avgCookTime =
    displayList.length > 0
      ? Math.round(
          displayList.reduce(
            (acc, r) => acc + (r.prep_time || 0) + (r.cook_time || 0),
            0,
          ) / displayList.length,
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171c29]">
          My Saved Collections
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Quickly access your favorite saved dishes and personal created
          recipes.
        </p>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#e3e8f0] p-4 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-500 rounded-lg">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">
              Favorites
            </p>
            <p className="text-2xl font-extrabold text-gray-800">
              {favoriteRecipes.length}
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e3e8f0] p-4 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-[#e05929] rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">
              My Recipes
            </p>
            <p className="text-2xl font-extrabold text-gray-800">
              {myRecipes.length}
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e3e8f0] p-4 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase">
              Avg Cooking Time
            </p>
            <p className="text-2xl font-extrabold text-gray-800">
              {avgCookTime} mins
            </p>
          </div>
        </div>
      </div>

      {/* Collection Tab Bar */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab("favorites")}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === "favorites"
              ? "border-[#e05929] text-[#e05929]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <Heart className="w-4 h-4" />
          Favorite Recipes ({favoriteRecipes.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("my_recipes")}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === "my_recipes"
              ? "border-[#e05929] text-[#e05929]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          My Created Recipes ({myRecipes.length})
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Content List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-[#e05929]" />
          <p className="text-sm font-medium">Loading collection...</p>
        </div>
      ) : displayList.length === 0 ? (
        <div className="bg-white border border-[#e3e8f0] rounded-xl p-12 text-center max-w-md mx-auto space-y-3">
          <p className="text-gray-500 text-sm">
            {activeTab === "favorites"
              ? "You haven't saved any recipes to your favorites yet."
              : "You haven't created any recipes yet."}
          </p>
          {activeTab === "favorites" ? (
            <Link
              to="/"
              className="inline-block bg-[#e05929] hover:bg-[#c8491f] text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
            >
              Explore Recipes
            </Link>
          ) : (
            <Link
              to="/recipes/create"
              className="inline-flex items-center gap-1.5 bg-[#e05929] hover:bg-[#c8491f] text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
            >
              <PlusCircle className="w-4 h-4" />
              Create First Recipe
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((recipe) => (
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
