import React from "react";
import { Bell, Plus, Search } from "lucide-react";

export default function Header({
  onNewTaskClick,
  onSearchChange,
  searchQuery,
}) {
  return (
    <header className="h-16 bg-white border-b border-[#e3e8f0] flex items-center justify-between px-8 sticky top-0 z-10">
      {/* Search Input */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#707a8c]" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery || ""}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-[#e3e8f0] rounded-lg text-sm focus:outline-none focus:border-[#2663eb] transition-colors"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* New Task Button */}
        {onNewTaskClick && (
          <button
            onClick={onNewTaskClick}
            className="flex items-center gap-2 bg-[#2663eb] hover:bg-[#2663eb]/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>
        )}

        {/* Notification Bell */}
        <button className="relative p-2 text-[#707a8c] hover:bg-[#f7fafc] rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-[#db2626] rounded-full" />
        </button>
      </div>
    </header>
  );
}
