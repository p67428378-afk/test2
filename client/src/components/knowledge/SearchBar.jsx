import React from "react";
import { Search, X, Tag as TagIcon, Filter } from "lucide-react";

export function SearchBar({
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagChange,
  availableTags = [],
  onClear,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search technical research notes by keyword, topic, or citations... (Press ⌘K)"
          className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {availableTags.length > 0 && (
        <div className="flex items-center space-x-2 overflow-x-auto pt-1 pb-1 text-xs">
          <div className="flex items-center space-x-1 text-slate-400 font-medium flex-shrink-0">
            <Filter className="h-3.5 w-3.5" />
            <span>Tags:</span>
          </div>
          <button
            onClick={() => onTagChange(null)}
            className={`px-2.5 py-1 rounded-full font-medium transition flex-shrink-0 ${
              !selectedTag
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Tags
          </button>
          {availableTags.map((t) => {
            const tagName = typeof t === "string" ? t : t.name;
            const isSelected = selectedTag === tagName;
            return (
              <button
                key={typeof t === "string" ? t : t.id || t.name}
                onClick={() => onTagChange(isSelected ? null : tagName)}
                className={`px-2.5 py-1 rounded-full font-medium transition flex items-center space-x-1 flex-shrink-0 ${
                  isSelected
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/50"
                }`}
              >
                <TagIcon className="h-3 w-3" />
                <span>{tagName}</span>
                {t.note_count !== undefined && (
                  <span className="opacity-75 text-[10px]">
                    ({t.note_count})
                  </span>
                )}
              </button>
            );
          })}
          {(searchQuery || selectedTag) && (
            <button
              onClick={onClear}
              className="text-xs text-red-600 hover:text-red-700 underline flex-shrink-0 ml-auto font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
