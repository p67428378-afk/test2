import React from "react";
import { X, Filter } from "lucide-react";
import Button from "../common/Button.jsx";

export default function FilterPanel({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  onClearFilters,
  brands = [],
}) {
  return (
    <div className="w-full md:w-64 flex-shrink-0 bg-slate-900/30 border border-slate-800 rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 font-bold text-slate-100">
          <Filter className="h-4 w-4 text-cyan-400" />
          <span>Filters</span>
        </div>
        <button
          onClick={onClearFilters}
          className="text-xs text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
        >
          <X className="h-3 w-3" />
          Clear All
        </button>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Sort By
        </label>
        <select
          value={sortBy || ""}
          onChange={(e) => setSortBy(e.target.value || null)}
          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
        >
          <option value="">Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Categories
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
              !selectedCategory
                ? "bg-cyan-500/10 text-cyan-400 font-medium"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedCategory === cat.id
                  ? "bg-cyan-500/10 text-cyan-400 font-medium"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Brands
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
          <button
            onClick={() => setSelectedBrand(null)}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
              !selectedBrand
                ? "bg-cyan-500/10 text-cyan-400 font-medium"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            }`}
          >
            All Brands
          </button>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                selectedBrand === brand
                  ? "bg-cyan-500/10 text-cyan-400 font-medium"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Price Range
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice || ""}
            onChange={(e) =>
              setMinPrice(e.target.value ? parseFloat(e.target.value) : null)
            }
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
          />
          <span className="text-slate-600">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice || ""}
            onChange={(e) =>
              setMaxPrice(e.target.value ? parseFloat(e.target.value) : null)
            }
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>
    </div>
  );
}
