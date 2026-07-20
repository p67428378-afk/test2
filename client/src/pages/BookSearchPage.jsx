import React, { useState, useEffect } from "react";
import SearchFilterBar from "../components/search/SearchFilterBar.jsx";
import BookGrid from "../components/search/BookGrid.jsx";
import EmptyState from "../components/search/EmptyState.jsx";
import { searchBooks } from "../services/api.js";

export default function BookSearchPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("Tolkien");
  const [searchBy, setSearchBy] = useState("all");
  const [sortBy, setSortBy] = useState("Relevance");
  const [page, setPage] = useState(1);
  const [totalPages, setPages] = useState(1);
  const [totalResults, setTotal] = useState(0);

  const fetchResults = async (searchParams) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: searchParams.page || 1,
        limit: 6,
      };

      if (searchParams.query) {
        params.query = searchParams.query;
        if (searchParams.searchBy && searchParams.searchBy !== "all") {
          params.search_by = searchParams.searchBy;
          if (searchParams.searchBy === "title") {
            params.title = searchParams.query;
          } else if (searchParams.searchBy === "author") {
            params.author = searchParams.query;
          } else if (searchParams.searchBy === "isbn") {
            params.isbn = searchParams.query;
            // Basic ISBN validation: 10 or 13 digits
            const cleanIsbn = searchParams.query.replace(/[- ]/g, "");
            if (!/^\d{10}(\d{3})?$/.test(cleanIsbn)) {
              throw new Error("Invalid ISBN format. Must be 10 or 13 digits.");
            }
          }
        }
      }

      const data = await searchBooks(params);
      setBooks(data.items || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
      setPage(data.page || 1);
    } catch (err) {
      setError(
        err.message || err.detail || "An error occurred while searching.",
      );
      setBooks([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Initial search on mount
  useEffect(() => {
    fetchResults({ query, searchBy, page: 1 });
  }, []);

  const handleSearch = ({ query: newQuery, searchBy: newSearchBy }) => {
    setQuery(newQuery);
    setSearchBy(newSearchBy);
    setPage(1);
    fetchResults({ query: newQuery, searchBy: newSearchBy, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchResults({ query, searchBy, page: newPage });
  };

  return (
    <main className="flex-1 p-margin-mobile md:p-margin-desktop">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-8">
        <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface mb-2">
          Search Library Catalog
        </h2>
        <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
          Find books by title, author, or ISBN. Results update dynamically as
          you type.
        </p>
      </div>

      {/* Search Interface */}
      <SearchFilterBar onSearch={handleSearch} initialQuery={query} />

      {/* Error Alert */}
      {error && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-error-container text-on-error-container rounded-lg border border-error/20 flex items-center gap-2">
          <span className="material-symbols-outlined text-error">error</span>
          <span className="text-body-md font-body-md">{error}</span>
        </div>
      )}

      {/* Results Section */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Searching catalog...
            </p>
          </div>
        ) : books.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <span className="text-body-md font-body-md text-on-surface-variant">
                Showing{" "}
                <strong className="text-on-surface">
                  {(page - 1) * 6 + 1}-{Math.min(page * 6, totalResults)}
                </strong>{" "}
                of <strong className="text-on-surface">{totalResults}</strong>{" "}
                results for "
                <strong className="text-on-surface">{query || "All"}</strong>"
              </span>
              <div className="flex items-center gap-2">
                <span className="text-label-md font-label-md text-on-surface-variant uppercase">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-body-md font-body-md text-primary bg-transparent border-none py-1 pl-2 pr-8 focus:ring-0 cursor-pointer font-semibold"
                >
                  <option>Relevance</option>
                  <option>Title (A-Z)</option>
                  <option>Year (Newest)</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <BookGrid books={books} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`px-4 py-2 text-body-md font-body-md flex items-center gap-1 ${
                    page === 1
                      ? "text-outline cursor-not-allowed"
                      : "text-primary hover:bg-primary/5 rounded-lg transition-colors font-semibold"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_left
                  </span>
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-body-md transition-colors ${
                        p === page
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-on-surface hover:bg-surface-container-high"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className={`px-4 py-2 text-body-md font-body-md flex items-center gap-1 ${
                    page === totalPages
                      ? "text-outline cursor-not-allowed"
                      : "text-primary hover:bg-primary/5 rounded-lg transition-colors font-semibold"
                  }`}
                >
                  Next
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_right
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          !loading && <EmptyState query={query} />
        )}
      </div>
    </main>
  );
}
