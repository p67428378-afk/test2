import React from "react";
import { Search, Plus } from "lucide-react";

export default function FilterRow({
  search = "",
  setSearch,
  category = "",
  setCategory,
  categories = [],
  onAddNewClick,
  canManage = false,
}) {
  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-4 shadow-sm w-full flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by SKU, name, desc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-48">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add New Item Button */}
      {canManage && (
        <button
          onClick={onAddNewClick}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-[#2563eb] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Item</span>
        </button>
      )}
    </div>
  );
}
