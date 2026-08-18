import React, { useState } from "react";
import { Search, Filter, X, Heart, Clock, Tag } from "lucide-react";

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

export default function RecipeFilter({
  categories = [],
  onFilterChange,
  currentFilters = {},
}) {
  const [search, setSearch] = useState(currentFilters.search || "");
  const [selectedCategory, setSelectedCategory] = useState(
    currentFilters.category_id || "",
  );
  const [maxCookTime, setMaxCookTime] = useState(
    currentFilters.max_cook_time || "",
  );
  const [selectedDietary, setSelectedDietary] = useState(
    currentFilters.dietary_tags || [],
  );
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredientsList, setIngredientsList] = useState(
    currentFilters.ingredients || [],
  );
  const [favoritesOnly, setFavoritesOnly] = useState(
    currentFilters.favorites_only || false,
  );

  const applyFilters = (updated) => {
    onFilterChange({
      search,
      category_id: selectedCategory,
      max_cook_time: maxCookTime,
      dietary_tags: selectedDietary,
      ingredients: ingredientsList,
      favorites_only: favoritesOnly,
      ...updated,
    });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    applyFilters({ search: val });
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSelectedCategory(val);
    applyFilters({ category_id: val });
  };

  const handleMaxCookTimeChange = (e) => {
    const val = e.target.value;
    setMaxCookTime(val);
    applyFilters({ max_cook_time: val });
  };

  const toggleDietaryTag = (tag) => {
    const next = selectedDietary.includes(tag)
      ? selectedDietary.filter((t) => t !== tag)
      : [...selectedDietary, tag];
    setSelectedDietary(next);
    applyFilters({ dietary_tags: next });
  };

  const handleAddIngredient = (e) => {
    if ((e.key === "Enter" || e.type === "click") && ingredientInput.trim()) {
      e.preventDefault();
      const val = ingredientInput.trim();
      if (!ingredientsList.includes(val)) {
        const next = [...ingredientsList, val];
        setIngredientsList(next);
        setIngredientInput("");
        applyFilters({ ingredients: next });
      }
    }
  };

  const removeIngredient = (ing) => {
    const next = ingredientsList.filter((i) => i !== ing);
    setIngredientsList(next);
    applyFilters({ ingredients: next });
  };

  const toggleFavoritesOnly = () => {
    const next = !favoritesOnly;
    setFavoritesOnly(next);
    applyFilters({ favorites_only: next });
  };

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setMaxCookTime("");
    setSelectedDietary([]);
    setIngredientsList([]);
    setFavoritesOnly(false);
    onFilterChange({});
  };

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Keyword Search */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by recipe title or description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#e05929] focus:border-transparent"
          />
        </div>

        {/* Category Selector */}
        <div className="w-full md:w-48">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#e05929]"
            aria-label="Filter by Category"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Max Cook Time Selector */}
        <div className="w-full md:w-44 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-gray-500 shrink-0" />
          <select
            value={maxCookTime}
            onChange={handleMaxCookTimeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#e05929]"
            aria-label="Max Cook Time"
          >
            <option value="">Max Cook Time</option>
            <option value="15">15 mins or less</option>
            <option value="30">30 mins or less</option>
            <option value="45">45 mins or less</option>
            <option value="60">60 mins or less</option>
          </select>
        </div>

        {/* Favorites Filter Toggle */}
        <button
          type="button"
          onClick={toggleFavoritesOnly}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition ${
            favoritesOnly
              ? "bg-red-50 border-red-300 text-red-600"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Heart
            className={`w-4 h-4 ${favoritesOnly ? "fill-red-500 text-red-500" : ""}`}
          />
          <span>Favorites Only</span>
        </button>
      </div>

      {/* Pantry Ingredients Filter */}
      <div className="pt-2 border-t border-gray-100">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Filter by Available Pantry Ingredients
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {ingredientsList.map((ing) => (
            <span
              key={ing}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#e05929]/10 text-[#e05929]"
            >
              {ing}
              <button
                type="button"
                onClick={() => removeIngredient(ing)}
                className="hover:text-red-600 focus:outline-none"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={ingredientInput}
              onChange={(e) => setIngredientInput(e.target.value)}
              onKeyDown={handleAddIngredient}
              placeholder="e.g. Chicken, Tomato..."
              className="px-3 py-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-[#e05929]"
            />
            <button
              type="button"
              onClick={handleAddIngredient}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium"
            >
              + Add Ingredient
            </button>
          </div>
        </div>
      </div>

      {/* Dietary Preference Filters */}
      <div className="pt-2 border-t border-gray-100">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Dietary Preferences
        </label>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((tag) => {
            const isSelected = selectedDietary.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleDietaryTag(tag)}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition ${
                  isSelected
                    ? "bg-[#e05929] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Clear Filters Button */}
      {(search ||
        selectedCategory ||
        maxCookTime ||
        selectedDietary.length > 0 ||
        ingredientsList.length > 0 ||
        favoritesOnly) && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-xs text-gray-500 hover:text-red-600 font-medium flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
