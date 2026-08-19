import React from "react";
import { Search, Filter, Plus } from "lucide-react";
import Button from "../common/Button";

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  categories = [],
  onCreateClick,
}) {
  const statusOptions = [
    "Pending",
    "In Progress",
    "Overdue",
    "Completed",
    "Cancelled",
  ];

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      {/* Search and Filters */}
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#707a8c]" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-[#707a8c] hidden sm:inline-block" />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="text-sm bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="text-sm bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2663eb]"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Action Button */}
      {onCreateClick && (
        <Button onClick={onCreateClick} icon={Plus} variant="primary">
          New Task
        </Button>
      )}
    </div>
  );
}
