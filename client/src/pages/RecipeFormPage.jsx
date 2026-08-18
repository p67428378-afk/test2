import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { recipeService, categoryService } from "../services/api";
import IngredientInputList from "../components/recipes/IngredientInputList";
import { ArrowLeft, Save, X, AlertCircle, Loader2 } from "lucide-react";

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Low-Carb",
  "Keto",
  "Paleo",
  "Nut-Free",
];

export default function RecipeFormPage({ currentUser, onOpenAuthModal }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [prepTime, setPrepTime] = useState(15);
  const [cookTime, setCookTime] = useState(30);
  const [servings, setServings] = useState(4);
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "" },
  ]);
  const [selectedDietaryTags, setSelectedDietaryTags] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchRecipeForEdit();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data || []);
      if (!isEditMode && data && data.length > 0) {
        setCategoryId(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const fetchRecipeForEdit = async () => {
    setFetching(true);
    try {
      const recipe = await recipeService.getRecipe(id);
      setTitle(recipe.title || "");
      setDescription(recipe.description || "");
      setCategoryId(recipe.category?.id || "");
      setPrepTime(recipe.prep_time || 0);
      setCookTime(recipe.cook_time || 0);
      setServings(recipe.servings || 1);
      setInstructions(recipe.instructions || "");
      setIngredients(
        recipe.ingredients && recipe.ingredients.length > 0
          ? recipe.ingredients
          : [{ name: "", quantity: "", unit: "" }],
      );
      setSelectedDietaryTags(recipe.dietary_tags || []);
    } catch (err) {
      setError("Failed to fetch recipe for editing.");
    } finally {
      setFetching(false);
    }
  };

  const toggleDietaryTag = (tag) => {
    if (selectedDietaryTags.includes(tag)) {
      setSelectedDietaryTags(selectedDietaryTags.filter((t) => t !== tag));
    } else {
      setSelectedDietaryTags([...selectedDietaryTags, tag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuthModal && onOpenAuthModal();
      return;
    }

    setLoading(true);
    setError("");

    // Clean ingredients: filter out empty names
    const cleanedIngredients = ingredients.filter(
      (ing) => ing.name && ing.name.trim(),
    );

    const payload = {
      title,
      description,
      category_id: categoryId || null,
      prep_time: Number(prepTime),
      cook_time: Number(cookTime),
      servings: Number(servings),
      instructions,
      ingredients: cleanedIngredients,
      dietary_tags: selectedDietaryTags,
    };

    try {
      if (isEditMode) {
        await recipeService.updateRecipe(id, payload);
        navigate(`/recipes/${id}`);
      } else {
        const created = await recipeService.createRecipe(payload);
        navigate(`/recipes/${created.id}`);
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === "string") {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join(", "));
      } else {
        setError("Failed to save recipe. Please check all fields.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-[#e05929]" />
        <p className="text-sm font-medium">Loading recipe details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        to={isEditMode ? `/recipes/${id}` : "/"}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e05929] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Cancel & Go Back
      </Link>

      <div className="bg-white border border-[#e3e8f0] rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-bold text-[#171c29]">
            {isEditMode ? "Edit Recipe" : "Create New Recipe"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill out the details below to publish or update your recipe.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-800 border-b pb-1">
              1. Basic Information
            </h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Recipe Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Creamy Tuscan Garlic Chicken"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e05929]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Short Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief overview of the recipe flavor, origin, or key features..."
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e05929]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#e05929]"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Prep Time (mins)
                </label>
                <input
                  type="number"
                  min="0"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e05929]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Cook Time (mins)
                </label>
                <input
                  type="number"
                  min="0"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e05929]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Servings
                </label>
                <input
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e05929]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dynamic Ingredient Rows */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <h3 className="text-base font-bold text-gray-800">
              2. Ingredients Required
            </h3>
            <IngredientInputList
              ingredients={ingredients}
              onChange={(updated) => setIngredients(updated)}
            />
          </div>

          {/* Section 3: Cooking Instructions */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <h3 className="text-base font-bold text-gray-800">
              3. Cooking Instructions *
            </h3>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Step 1: Season chicken breast with salt and pepper...&#10;Step 2: Heat olive oil in a skillet..."
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e05929]"
              required
            />
          </div>

          {/* Section 4: Dietary Preferences */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <h3 className="text-base font-bold text-gray-800">
              4. Dietary Preferences & Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((tag) => {
                const isSelected = selectedDietaryTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleDietaryTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                      isSelected
                        ? "bg-[#e05929] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tag} {isSelected ? "✓" : "+"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate(isEditMode ? `/recipes/${id}` : "/")}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#e05929] hover:bg-[#c8491f] text-white rounded-lg text-sm font-semibold transition flex items-center gap-2 disabled:opacity-50 shadow-sm"
            >
              <Save className="w-4 h-4" />
              {loading
                ? "Saving..."
                : isEditMode
                  ? "Update Recipe"
                  : "Save Recipe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
