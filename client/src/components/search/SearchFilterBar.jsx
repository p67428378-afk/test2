import React, { useState, useEffect, useRef } from "react";

export default function SearchFilterBar({ onSearch, initialQuery = "" }) {
  const [query, setQuery] = useState(initialQuery);
  const [searchBy, setSearchBy] = useState("all");
  const isFirstRender = useRef(true);

  // Debounce search query changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      onSearch({ query, searchBy });
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query, searchBy]);

  const handleSearchClick = () => {
    onSearch({ query, searchBy });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch({ query, searchBy });
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-surface-container-lowest border border-outline-variant rounded-xl p-6 mb-8 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            type="text"
            className="w-full h-12 pl-12 pr-4 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-body-lg font-body-lg text-on-surface placeholder:text-outline transition-colors"
            placeholder="Type to search by title, author, or 13-digit ISBN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="w-full md:w-48 relative">
          <select
            className="w-full h-12 px-4 appearance-none bg-surface border border-outline-variant rounded-lg text-body-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-colors"
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
          >
            <option value="all">All Fields</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="isbn">ISBN</option>
          </select>
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
            expand_more
          </span>
        </div>
        <button
          onClick={handleSearchClick}
          className="h-12 px-8 bg-primary text-on-primary rounded-lg font-body-md font-semibold hover:bg-surface-tint transition-colors shadow-sm active:scale-[0.98]"
        >
          Search
        </button>
      </div>
    </div>
  );
}
