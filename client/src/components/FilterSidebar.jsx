import React from "react";
import { Filter, Search, RotateCcw, Check } from "lucide-react";

const DEFAULT_CATEGORIES = [
  "All",
  "Electronics",
  "Audio",
  "Wearables",
  "Accessories",
  "Home & Kitchen",
];

export default function FilterSidebar({
  selectedCategory = "All",
  onSelectCategory,
  searchTerm = "",
  onSearchChange,
  inStockOnly = false,
  onToggleInStock,
  onResetFilters,
}) {
  return (
    <aside className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Filters & Search</span>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs text-slate-500 hover:text-indigo-600 flex items-center space-x-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label
          htmlFor="search-input"
          className="block text-xs font-semibold text-slate-700 mb-1.5"
        >
          Search Products
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            id="search-input"
            type="text"
            placeholder="Search by name, tags..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Category
        </label>
        <div className="space-y-1">
          {DEFAULT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{cat}</span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-indigo-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* In-Stock Filter Toggle */}
      <div className="pt-3 border-t border-slate-100">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-semibold text-slate-700">
            In-Stock Only
          </span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
          />
        </label>
      </div>
    </aside>
  );
}
