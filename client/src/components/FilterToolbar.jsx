import React from "react";
import {
  Search,
  SlidersHorizontal,
  Calendar,
  X,
  RotateCcw,
} from "lucide-react";

const CATEGORIES = ["All", "Work", "Personal", "Urgent", "Promotional"];

export default function FilterToolbar({
  search = "",
  onSearchChange,
  category = "All",
  onCategoryChange,
  minConfidence = 0,
  onMinConfidenceChange,
  startDate = "",
  onStartDateChange,
  endDate = "",
  onEndDateChange,
  onResetFilters,
}) {
  const hasActiveFilters =
    Boolean(search) ||
    category !== "All" ||
    minConfidence > 0 ||
    Boolean(startDate) ||
    Boolean(endDate);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top row: Search bar & Category pills */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by subject, sender, or content keyword..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {CATEGORIES.map((cat) => {
            const isSelected = category.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom row: Advanced sliders & date filters */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
        {/* Confidence threshold slider */}
        <div className="flex items-center gap-3 min-w-[240px]">
          <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-medium text-slate-600 shrink-0">
            Min Confidence:
          </span>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={minConfidence}
            onChange={(e) => onMinConfidenceChange(Number(e.target.value))}
            className="w-28 sm:w-36 accent-indigo-600 cursor-pointer"
          />
          <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            {minConfidence}%
          </span>
        </div>

        {/* Date Range Selectors */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="bg-transparent text-xs text-slate-700 focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="bg-transparent text-xs text-slate-700 focus:outline-none cursor-pointer"
            />
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
