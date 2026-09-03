import React from "react";
import { Filter, Car, Bike, Layers } from "lucide-react";

export default function CategoryFilterToolbar({
  categories = [],
  selectedCategory,
  onSelectCategory,
  categoryCounts = {},
}) {
  const getCategoryIcon = (name) => {
    const lower = (name || "").toLowerCase();
    if (lower.includes("car")) return "🚘";
    if (lower.includes("bike")) return "🏍️";
    if (lower.includes("truck")) return "🚚";
    if (lower.includes("suv")) return "🚙";
    return "🚗";
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-blue-600" />
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Filter by Category:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* All Categories Button */}
        <button
          type="button"
          onClick={() => onSelectCategory("")}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            !selectedCategory
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Categories</span>
          {categoryCounts.all !== undefined && (
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                !selectedCategory
                  ? "bg-blue-700 text-white"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {categoryCounts.all}
            </span>
          )}
        </button>

        {/* Dynamic Category Pill Buttons */}
        {categories.map((cat) => {
          const isSelected =
            selectedCategory?.toLowerCase() === cat.name.toLowerCase();
          const count = categoryCounts[cat.name.toLowerCase()];
          const icon = getCategoryIcon(cat.name);

          return (
            <button
              key={cat.id || cat.name}
              type="button"
              onClick={() => onSelectCategory(cat.name)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isSelected
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span>
                {icon} {cat.name}
              </span>
              {count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isSelected
                      ? "bg-blue-700 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Select Dropdown for Mobile / Compact view */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="category-select"
          className="text-xs text-slate-500 font-medium hidden sm:inline"
        >
          Select:
        </label>
        <select
          id="category-select"
          value={selectedCategory || ""}
          onChange={(e) => onSelectCategory(e.target.value)}
          className="p-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
        >
          <option value="">All Categories (Default)</option>
          {categories.map((cat) => (
            <option key={cat.id || cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
