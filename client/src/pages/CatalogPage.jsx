import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  ShieldCheck,
  ThermometerSnowflake,
} from "lucide-react";
import { getChocolates } from "../services/api";
import FilterSidebar from "../components/catalog/FilterSidebar";
import ChocolateGrid from "../components/catalog/ChocolateGrid";

const INITIAL_FILTERS = {
  min_cocoa: "",
  max_cocoa: "",
  origin: "",
  flavor: "",
  dietary: "",
};

export const CatalogPage = () => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [chocolates, setChocolates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchCatalog = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getChocolates(filters);
      setChocolates(data);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err.message ||
          "Failed to load chocolates",
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchQuery("");
  };

  // Client-side text search refinement on top of query results
  const displayedChocolates = chocolates.filter((choc) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = choc.title?.toLowerCase().includes(q);
    const descMatch = choc.description?.toLowerCase().includes(q);
    const originMatch = choc.origin_region?.toLowerCase().includes(q);
    const flavorMatch = choc.flavor_notes?.toLowerCase().includes(q);
    return titleMatch || descMatch || originMatch || flavorMatch;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#2D1B18] via-[#3D2521] to-[#1A0F0D] text-white p-8 sm:p-12 shadow-xl overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#D4AF37]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rare Harvests &amp; Single-Origin Cacao</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Artisanal Exotic Chocolate Storefront
            </h1>
            <p className="mt-4 text-sm sm:text-base text-stone-300 leading-relaxed">
              Explore rare micro-batch bars, estate harvests from 50% to 100%
              cocoa, and handcrafted truffles delivered in cold-pack thermal
              packaging.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-[#F4E8C1]">
              <span className="flex items-center">
                <ThermometerSnowflake className="w-4 h-4 mr-1 text-[#00796B]" />
                Cold-Pack Thermal Insulated Shipping
              </span>
              <span className="flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1 text-[#D4AF37]" />
                Pure Origin &amp; Dietary Transparency
              </span>
            </div>
          </div>
        </div>

        {/* Search Bar & Mobile Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-[#E8E2DC] shadow-sm">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by cocoa name, origin (e.g., Madagascar, Ecuador), tasting notes (Floral, Citrus)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[#E8E2DC] focus:border-[#2D1B18] focus:ring-1 focus:ring-[#2D1B18] text-sm text-[#2D1B18] placeholder-stone-400"
            />
          </div>

          <button
            onClick={() => setShowMobileFilters((prev) => !prev)}
            className="lg:hidden flex items-center space-x-2 px-4 py-2.5 bg-[#2D1B18] text-[#D4AF37] rounded-xl text-sm font-semibold"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{showMobileFilters ? "Hide Filters" : "Show Filters"}</span>
          </button>
        </div>

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Filter Sidebar - Desktop & Conditional Mobile */}
          <div
            className={`w-full lg:w-72 ${showMobileFilters ? "block" : "hidden lg:block"}`}
          >
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              totalResults={displayedChocolates.length}
            />
          </div>

          {/* Product Grid Area */}
          <div className="flex-1 w-full">
            <ChocolateGrid
              chocolates={displayedChocolates}
              loading={loading}
              error={error}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
