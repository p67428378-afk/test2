import React from "react";

export default function FilterBar({
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
}) {
  const categories = ["All", "Kids", "Professionals", "Seniors"];

  return (
    <div class="flex flex-col gap-4 pb-6 border-b border-gray-200">
      {/* Search Bar for Mobile/Tablet */}
      <div class="relative w-full md:hidden">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/10 transition-all text-sm text-gray-800 placeholder:text-gray-400"
          placeholder="Search creative lunch boxes..."
        />
      </div>

      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Category Filters */}
        <div class="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              class={`px-4 py-2 font-medium text-sm rounded-lg transition-all flex items-center gap-1.5 ${
                activeCategory === cat
                  ? "bg-[#006c49] text-white shadow-sm"
                  : "bg-white hover:bg-gray-50 border border-gray-200 text-gray-600"
              }`}
            >
              {cat === "Kids" && (
                <span class="material-symbols-outlined text-sm">
                  cruelty_free
                </span>
              )}
              {cat === "Professionals" && (
                <span class="material-symbols-outlined text-sm">work</span>
              )}
              {cat === "Seniors" && (
                <span class="material-symbols-outlined text-sm">favorite</span>
              )}
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div class="relative w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            class="w-full sm:w-auto appearance-none bg-white border border-gray-200 text-gray-700 font-medium text-sm rounded-lg pl-4 pr-10 py-2 focus:border-[#006c49] focus:ring-1 focus:ring-[#006c49] cursor-pointer"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="low-to-high">Price: Low to High</option>
            <option value="high-to-low">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
          <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            expand_more
          </span>
        </div>
      </div>
    </div>
  );
}
