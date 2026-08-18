import React from "react";
import { Search, Filter, RotateCcw } from "lucide-react";

export default function ExpenseFilterBar({
  search,
  setSearch,
  categoryId,
  setCategoryId,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  categories = [],
  onApplyFilters,
  onResetFilters,
}) {
  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between">
      <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search description/payment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          />
        </div>

        {/* Category filter */}
        <div className="min-w-[140px]">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-1.5 border border-[#e3e8f0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Start */}
        <div className="flex items-center gap-1 text-xs text-[#707a8c]">
          <span>From:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-2 py-1 border border-[#e3e8f0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          />
        </div>

        {/* Date End */}
        <div className="flex items-center gap-1 text-xs text-[#707a8c]">
          <span>To:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-2 py-1 border border-[#e3e8f0] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onApplyFilters}
          className="bg-[#2663eb] text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-[#1d4ed8] transition-colors flex items-center gap-1"
        >
          <Filter className="w-4 h-4" /> Filter
        </button>
        <button
          onClick={onResetFilters}
          className="bg-gray-100 text-[#707a8c] px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>
    </div>
  );
}
