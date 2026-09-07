import React from "react";
import {
  SlidersHorizontal,
  RotateCcw,
  Star,
  DollarSign,
  Tag,
  RefreshCw,
} from "lucide-react";

export default function FilterSidebar({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  billingFrequency,
  setBillingFrequency,
  onResetFilters,
}) {
  return (
    <aside className="w-full lg:w-64 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <h2 className="font-serif font-bold text-slate-900 text-lg">
            Filters
          </h2>
        </div>
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 font-medium transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          Category
        </label>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-slate-900">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === null}
              onChange={() => setSelectedCategory(null)}
              className="text-primary focus:ring-primary h-4 w-4"
            />
            <span>All Categories</span>
          </label>
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:text-slate-900"
            >
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat.id}
                onChange={() => setSelectedCategory(cat.id)}
                className="text-primary focus:ring-primary h-4 w-4"
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Max Price Threshold Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            Max Price / Month
          </label>
          <span className="text-xs font-bold text-primary bg-slate-100 px-2 py-0.5 rounded">
            {maxPrice ? `$${maxPrice}` : "Any"}
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="200"
          step="5"
          value={maxPrice || 200}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-primary h-2 bg-slate-100 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>$10</span>
          <span>$100</span>
          <span>$200</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-slate-400" />
          Min Subscriber Rating
        </label>
        <div className="flex gap-1">
          {[0, 3, 4, 4.5].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(rating)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center justify-center gap-0.5 ${
                minRating === rating
                  ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {rating === 0 ? "Any" : `${rating}+`}
              {rating > 0 && (
                <Star className="w-3 h-3 fill-current text-white" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Billing Frequency */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          Billing Frequency
        </label>
        <select
          value={billingFrequency || ""}
          onChange={(e) => setBillingFrequency(e.target.value || null)}
          className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <option value="">All Frequencies</option>
          <option value="Monthly">Monthly</option>
          <option value="Bi-Monthly">Bi-Monthly</option>
          <option value="Quarterly">Quarterly</option>
        </select>
      </div>
    </aside>
  );
}
