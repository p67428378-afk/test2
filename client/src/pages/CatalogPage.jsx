import React, { useState, useEffect, useCallback } from "react";
import { Sparkles, Radio, AlertCircle, RefreshCw, Layers } from "lucide-react";
import { getPodcasts } from "../services/api";
import SearchBar from "../components/common/SearchBar";
import CategoryPills from "../components/common/CategoryPills";
import PodcastCard from "../components/podcast/PodcastCard";
import { Link } from "react-router-dom";

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [podcasts, setPodcasts] = useState([]);
  const [featuredPodcast, setFeaturedPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPodcasts({
        search,
        category,
        page,
        limit: 10,
      });
      setPodcasts(data.items || []);
      setTotalPages(data.pages || 1);
      setTotalCount(data.total || 0);

      // Select featured podcast (e.g., first show or highest subscribers)
      if (data.items && data.items.length > 0 && !featuredPodcast) {
        const topShow = [...data.items].sort(
          (a, b) => (b.total_subscribers || 0) - (a.total_subscribers || 0),
        )[0];
        setFeaturedPodcast(topShow);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to load podcasts. Please check your network connection and backend service.",
      );
    } finally {
      setLoading(false);
    }
  }, [search, category, page, featuredPodcast]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const handleCategorySelect = (selectedCat) => {
    setCategory(selectedCat);
    setPage(1);
  };

  const handleSearchChange = (query) => {
    setSearch(query);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Hero Search & Category Section */}
      <section className="bg-white border border-[#e3e8f0] p-6 md:p-8 rounded-2xl shadow-sm space-y-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#171c29] leading-tight mb-1">
            Find Your Next Favorite Podcast
          </h1>
          <p className="text-xs md:text-sm text-[#707a8c]">
            Browse thousands of shows across technology, business, comedy,
            science, and more.
          </p>
        </div>

        <SearchBar
          value={search}
          onChange={handleSearchChange}
          onClear={() => handleSearchChange("")}
        />

        <CategoryPills
          selectedCategory={category}
          onSelectCategory={handleCategorySelect}
        />
      </section>

      {/* Featured Podcast Hero Card */}
      {featuredPodcast && !search && !category && (
        <section className="bg-gradient-to-r from-blue-900 to-[#2663eb] rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-[#17a34a] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Show</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                {featuredPodcast.title}
              </h2>
              <p className="text-xs md:text-sm text-blue-100 font-medium">
                Hosted by {featuredPodcast.author} •{" "}
                {(featuredPodcast.total_subscribers || 0).toLocaleString()}{" "}
                Subscribers • Daily Updates
              </p>
              <p className="text-xs md:text-sm text-blue-50 line-clamp-2 leading-relaxed">
                {featuredPodcast.description}
              </p>
            </div>

            <Link
              to={`/podcasts/${featuredPodcast.id}`}
              className="px-6 py-3 bg-white text-[#2663eb] hover:bg-blue-50 font-bold text-sm rounded-xl shadow-md transition-all shrink-0 hover:scale-105 active:scale-95"
            >
              Explore Show &rarr;
            </Link>
          </div>
        </section>
      )}

      {/* Catalog Grid Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#171c29] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#2663eb]" />
            <span>
              {category ? `${category} Shows` : "Explore All Podcasts"}
            </span>
            <span className="text-xs font-normal text-[#707a8c]">
              ({totalCount} {totalCount === 1 ? "show" : "shows"})
            </span>
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white border border-[#e3e8f0] rounded-2xl p-5 shadow-sm animate-pulse space-y-4"
              >
                <div className="aspect-square bg-slate-200 rounded-xl"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                <div className="h-10 bg-slate-100 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
            <h3 className="font-bold text-red-800 text-base">
              Unable to load podcasts
            </h3>
            <p className="text-xs text-red-600 max-w-md mx-auto">{error}</p>
            <button
              type="button"
              onClick={fetchCatalog}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && podcasts.length === 0 && (
          <div className="bg-white border border-[#e3e8f0] rounded-2xl p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-[#f2f5fa] text-[#2663eb] rounded-2xl flex items-center justify-center mx-auto text-3xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-[#171c29]">
              No podcasts found
            </h3>
            <p className="text-xs md:text-sm text-[#707a8c] max-w-sm mx-auto">
              We couldn't find any podcast shows matching "{search || category}
              ". Try adjusting your search query or filter.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-[#2663eb] text-white hover:bg-blue-700 text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              Clear Search & Reset Filters
            </button>
          </div>
        )}

        {/* Podcast Cards Grid */}
        {!loading && !error && podcasts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {podcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#e3e8f0] text-[#171c29] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
            >
              &larr; Previous
            </button>
            <span className="text-xs font-medium text-[#707a8c] px-3">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#e3e8f0] text-[#171c29] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors shadow-sm"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
