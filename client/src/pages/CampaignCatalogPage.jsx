import React, { useState, useEffect } from "react";
import { Search, Filter, RefreshCw, Heart, AlertCircle } from "lucide-react";
import CampaignCard from "../components/campaigns/CampaignCard";
import { campaignsAPI } from "../services/api";

export default function CampaignCatalogPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [sortBy, setSortBy] = useState("created_at");

  const CATEGORIES = [
    "all",
    "Medical",
    "Education",
    "Environment",
    "Disaster Relief",
    "Community",
  ];

  const fetchCampaigns = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await campaignsAPI.getCampaigns({
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        search: searchQuery.trim() || undefined,
        status: statusFilter,
        limit: 50,
      });

      let items = data.items || [];

      // Sorting
      items = [...items].sort((a, b) => {
        if (sortBy === "raised") {
          return Number(b.current_amount || 0) - Number(a.current_amount || 0);
        } else if (sortBy === "end_date") {
          return new Date(a.end_date || 0) - new Date(b.end_date || 0);
        } else {
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        }
      });

      setCampaigns(items);
    } catch (err) {
      setError(
        "Failed to load campaigns. Please verify backend server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [categoryFilter, statusFilter, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCampaigns();
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("Active");
    setSortBy("created_at");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner (Figma inspired layout) */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 rounded-3xl p-8 md:p-12 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-12">
          <Heart className="w-96 h-96 fill-current" />
        </div>
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-100 border border-white/30">
            <span>GiveHope Donation Portal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Empower Communities Through Giving
          </h1>
          <p className="text-blue-100 text-sm md:text-base leading-relaxed">
            Explore active fundraising campaigns, support meaningful causes, and
            make a lasting impact today.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col md:flex-row items-center gap-4"
        >
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search campaigns by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Status: Active</option>
              <option value="Paused">Status: Paused</option>
              <option value="Completed">Status: Completed</option>
              <option value="all">Status: All</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-auto bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_at">Sort: Newest</option>
              <option value="raised">Sort: Highest Raised</option>
              <option value="end_date">Sort: Ending Soon</option>
            </select>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm"
            >
              Search
            </button>
          </div>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Categories:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all capitalize whitespace-nowrap ${
                categoryFilter === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchCampaigns}
            className="text-xs bg-red-100 hover:bg-red-200 text-red-800 font-bold px-3 py-1.5 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Campaign Catalog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl h-96 border border-slate-200 animate-pulse p-6 space-y-4"
            >
              <div className="h-40 bg-slate-100 rounded-xl" />
              <div className="h-6 bg-slate-100 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        /* Empty Search Results Edge Case (AC1) */
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              No campaigns found
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              We couldn't find any campaigns matching your search parameters or
              category filter.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
}
