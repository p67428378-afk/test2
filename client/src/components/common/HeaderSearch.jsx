import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useProductSearch } from "../../hooks/useProductSearch.js";
import SearchDropdown from "./SearchDropdown.jsx";

export default function HeaderSearch() {
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const {
    query,
    setQuery,
    debouncedQuery,
    selectedCategory,
    setSelectedCategory,
    recentSearches,
    suggestions,
    categories,
    loading,
    error,
    isFocused,
    setIsFocused,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    handleSelectSuggestion,
    handleSelectRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    clearQuery,
    retry,
  } = useProductSearch();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsFocused]);

  return (
    <>
      {/* Dark background overlay when search is focused */}
      {isFocused && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 transition-opacity duration-200"
          onClick={() => setIsFocused(false)}
          data-testid="search-overlay"
        />
      )}

      {/* Centered Search Bar Container */}
      <div
        ref={containerRef}
        className="relative z-40 w-full max-w-[560px] mx-auto"
      >
        <div
          className={`flex items-center gap-2 px-3 py-2 bg-slate-800/90 border-2 rounded-xl transition-all duration-200 ${
            isFocused
              ? "border-blue-500 bg-slate-900 shadow-lg shadow-blue-500/10"
              : "border-slate-700/80 hover:border-slate-600"
          }`}
        >
          <Search
            className={`w-5 h-5 shrink-0 ${isFocused ? "text-blue-400" : "text-slate-400"}`}
          />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search products, brands, or categories..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm focus:outline-none"
          />

          {query ? (
            <button
              type="button"
              onClick={clearQuery}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-800 transition-colors"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-[10px] font-bold text-slate-400 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded uppercase">
              ESC
            </span>
          )}
        </div>

        {/* Dropdown Menu */}
        {isFocused && (
          <SearchDropdown
            query={query}
            debouncedQuery={debouncedQuery}
            loading={loading}
            error={error}
            suggestions={suggestions}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            recentSearches={recentSearches}
            onSelectRecentSearch={handleSelectRecentSearch}
            onRemoveRecentSearch={removeRecentSearch}
            onClearRecentSearches={clearRecentSearches}
            onSelectSuggestion={handleSelectSuggestion}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            onClearSearch={clearQuery}
            onRetry={retry}
          />
        )}
      </div>
    </>
  );
}
