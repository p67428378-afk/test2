import React from "react";

export default function FilterAndSearchBar({
  searchTerm = "",
  onSearchChange,
  currentFilter = "all",
  onFilterChange,
  counts = { all: 0, active: 0, completed: 0 },
}) {
  const tabs = [
    { id: "all", label: "All", count: counts.all },
    { id: "active", label: "Active", count: counts.active },
    { id: "completed", label: "Completed", count: counts.completed },
  ];

  return (
    <div
      className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between w-full"
      data-node-id="2:64"
      data-name="FilterControls"
    >
      {/* Search Input */}
      <div className="flex flex-[2_0_0] relative" data-name="SearchBar">
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707a8c] text-[14px]"
          data-node-id="2:66"
        >
          🔍
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks by keyword..."
          className="bg-[#f2f5fa] border border-[#e3e8f0] rounded-[10px] pl-9 pr-4 py-2.5 text-[14px] text-[#171c29] placeholder-[#707a8c] focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:bg-white transition-all w-full"
          data-node-id="2:67"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#707a8c] hover:text-[#171c29]"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tab Filter */}
      <div
        className="flex flex-[1_0_0] justify-start sm:justify-end"
        data-name="TabBar"
      >
        <div className="flex gap-2 sm:gap-4 items-center">
          {tabs.map((tab) => {
            const isActive = currentFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange(tab.id)}
                className="flex flex-col items-center px-2 py-1 relative transition-colors"
                data-name="Tab"
              >
                <span
                  className={`text-[14px] whitespace-nowrap ${
                    isActive
                      ? "font-bold text-[#2663eb]"
                      : "font-medium text-[#707a8c] hover:text-[#171c29]"
                  }`}
                >
                  {tab.label} ({tab.count})
                </span>
                {isActive && (
                  <div
                    className="bg-[#2663eb] h-[3px] rounded-full w-6 mt-1"
                    data-name="ActiveIndicator"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
