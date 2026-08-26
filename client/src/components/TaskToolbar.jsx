import React from "react";
import { Plus, Search, Filter } from "lucide-react";

export default function TaskToolbar({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
}) {
  return (
    <div className="bg-white border border-[#e3e8f0] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 w-full shadow-sm">
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#707a8c] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#f2f5fa] border border-[#e3e8f0] rounded-lg text-sm text-[#171c29] placeholder-[#707a8c] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#f2f5fa] p-1 rounded-lg border border-[#e3e8f0] w-full sm:w-auto justify-center">
          <Filter className="w-3.5 h-3.5 text-[#707a8c] ml-1 mr-1 hidden md:inline" />
          <button
            type="button"
            onClick={() => onFilterChange("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              filter === "all"
                ? "bg-white text-[#2663eb] shadow-sm"
                : "text-[#707a8c] hover:text-[#171c29]"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("pending")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              filter === "pending"
                ? "bg-white text-[#eb9917] shadow-sm"
                : "text-[#707a8c] hover:text-[#171c29]"
            }`}
          >
            Pending
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("completed")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              filter === "completed"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-[#707a8c] hover:text-[#171c29]"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenCreateModal}
        className="bg-[#2663eb] hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-colors w-full sm:w-auto justify-center"
      >
        <Plus className="w-4 h-4" />
        <span>Create New Task</span>
      </button>
    </div>
  );
}
