import React from "react";
import CategoryFilterPills from "./CategoryFilterPills.jsx";
import SuggestionItem from "./SuggestionItem.jsx";
import SkeletonLoader from "./SkeletonLoader.jsx";
import { Clock, X, AlertTriangle, SearchX, RefreshCw } from "lucide-react";

export default function SearchDropdown({
  query,
  debouncedQuery,
  loading,
  error,
  suggestions = [],
  categories = [],
  selectedCategory,
  onSelectCategory,
  recentSearches = [],
  onSelectRecentSearch,
  onRemoveRecentSearch,
  onClearRecentSearches,
  onSelectSuggestion,
  selectedIndex,
  setSelectedIndex,
  onClearSearch,
  onRetry,
}) {
  const isQueryActive = debouncedQuery.trim().length >= 3;

  return (
    <div
      className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl overflow-hidden z-50 flex flex-col"
      style={{ maxHeight: "400px" }}
      data-testid="search-dropdown"
    >
      {/* Inline Error Alert */}
      {error && (
        <div className="bg-rose-500/10 border-b border-rose-500/20 p-3 px-4 flex items-center justify-between text-rose-400 text-xs font-medium">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>⚠️ Unable to load suggestions. Retrying...</span>
          </div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="flex items-center gap-1 text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 px-2.5 py-1 rounded transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          )}
        </div>
      )}

      <div className="p-3 overflow-y-auto flex-1 space-y-3">
        {/* State 1: Skeleton Loader */}
        {loading && <SkeletonLoader count={3} />}

        {/* State 2: Active Search Results */}
        {!loading && !error && isQueryActive && (
          <>
            {categories && categories.length > 0 && (
              <CategoryFilterPills
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={onSelectCategory}
              />
            )}

            {suggestions.length > 0 ? (
              <div className="space-y-1">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Product Suggestions ({suggestions.length})
                </div>
                {suggestions.map((item, index) => (
                  <SuggestionItem
                    key={item.id || index}
                    item={item}
                    isActive={selectedIndex === index}
                    onClick={onSelectSuggestion}
                    onMouseEnter={() => setSelectedIndex(index)}
                  />
                ))}
              </div>
            ) : (
              /* State 3: Empty State */
              <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                  <SearchX className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-slate-200 text-sm">
                    No products found for '{query}'
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try checking for spelling errors or using different
                    keywords.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-4 py-2 rounded-md transition-colors shadow-sm"
                >
                  Clear search
                </button>
              </div>
            )}
          </>
        )}

        {/* State 4: Recent Search Queries (When query is empty or < 3 chars) */}
        {!loading && !isQueryActive && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Recent Searches
              </span>
              {recentSearches.length > 0 && (
                <button
                  type="button"
                  onClick={onClearRecentSearches}
                  className="text-[11px] text-blue-400 hover:underline"
                >
                  Clear history
                </button>
              )}
            </div>

            {recentSearches.length > 0 ? (
              <div className="space-y-1">
                {recentSearches.map((searchStr, index) => (
                  <div
                    key={index}
                    role="option"
                    aria-selected={selectedIndex === index}
                    onClick={() => onSelectRecentSearch(searchStr)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between p-2 px-3 rounded-lg cursor-pointer text-sm transition-colors ${
                      selectedIndex === index
                        ? "bg-blue-600/20 text-blue-200"
                        : "hover:bg-slate-800/60 text-slate-300"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      {searchStr}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveRecentSearch(searchStr);
                      }}
                      className="text-slate-500 hover:text-slate-300 p-1 rounded hover:bg-slate-700/50"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 px-2 py-3 text-center">
                No recent searches. Start typing to discover products.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
