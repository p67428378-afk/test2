import React from "react";
import { Search, Filter, Plus, RotateCcw } from "lucide-react";

const CATEGORIES = [
  "Food & Dining",
  "Housing & Utilities",
  "Transportation",
  "Entertainment",
  "Shopping",
  "Healthcare",
  "Miscellaneous",
];

export default function ExpenseFilterBar({
  search,
  setSearch,
  category,
  setCategory,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onReset,
  onOpenAddModal,
}) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
      <div className="flex flex-1 flex-wrap gap-3 items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search descriptions..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white transition-all"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative min-w-[160px]">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 focus:bg-white text-slate-700 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <Filter className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Date Range Inputs */}
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            title="Start Date"
            aria-label="Start Date"
            className="px-2.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
          />
          <span className="text-slate-400 text-xs">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            title="End Date"
            aria-label="End Date"
            className="px-2.5 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white"
          />
        </div>

        {/* Reset Filters */}
        {(search || category || startDate || endDate) && (
          <button
            onClick={onReset}
            className="flex items-center space-x-1 px-3 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm hover:bg-slate-100 transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>

      {/* Primary Action Button */}
      <button
        onClick={onOpenAddModal}
        className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
      >
        <Plus className="w-4 h-4" />
        <span>Add Expense</span>
      </button>
    </div>
  );
}
