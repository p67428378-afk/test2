import React, { useState, useEffect } from "react";
import { packageService } from "../services/api";
import PackageCard from "../components/packages/PackageCard";

export default function ExplorePage({ comparedIds, onCompareToggle }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState("1");
  const [activeCategory, setActiveCategory] = useState("All");

  const fetchPackages = async (searchParams = {}) => {
    try {
      setLoading(true);
      const data = await packageService.getPackages(searchParams);
      setPackages(data.items || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching packages:", err);
      setError("Failed to load packages. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (destination) params.destination = destination;
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    if (travelers) params.travelers = parseInt(travelers, 10);
    fetchPackages(params);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    // Filter locally or fetch with specific destination/tag if backend supports it
    if (category === "All") {
      fetchPackages();
    } else {
      // Map category to destination filter for demo/simplicity
      const destMap = {
        "Beach & Tropical": "Hawaii",
        "Adventure & Hiking": "Swiss",
        "Cultural & Historic": "Japan",
        Cruises: "Cruise",
      };
      fetchPackages({ destination: destMap[category] || "" });
    }
  };

  return (
    <div className="flex-1 p-lg w-full max-w-max-content-width mx-auto">
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2 text-2xl font-bold">
          Explore Your Next Adventure
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Discover curated packages tailored for effortless travel.
        </p>
      </div>

      {/* Search Panel Card */}
      <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] mb-8">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
        >
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md text-on-surface-variant font-semibold text-sm">
              Destination
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-primary">
                location_on
              </span>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface"
                type="text"
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md text-on-surface-variant font-semibold text-sm">
              Start Date
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-primary">
                calendar_today
              </span>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md text-on-surface-variant font-semibold text-sm">
              End Date
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-primary">
                calendar_today
              </span>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md text-on-surface-variant font-semibold text-sm">
              Travelers
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-primary">
                group
              </span>
              <select
                className="w-full pl-10 pr-8 py-2.5 bg-surface border border-outline-variant/50 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface appearance-none"
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
              >
                <option value="1">1 Adult</option>
                <option value="2">2 Adults</option>
                <option value="3">3 Adults</option>
                <option value="4">Family (4)</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-outline-variant pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
          <div className="md:col-span-4 flex justify-end mt-2">
            <button
              type="submit"
              className="bg-primary-container text-on-primary hover:bg-primary-container/90 px-6 py-2.5 rounded-lg font-label-md text-label-md shadow-sm transition-colors flex items-center gap-2 font-semibold"
            >
              <span className="material-symbols-outlined text-sm">search</span>
              Search Packages
            </button>
          </div>
        </form>
      </section>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          "All",
          "Beach & Tropical",
          "Adventure & Hiking",
          "Cultural & Historic",
          "Cruises",
        ].map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 rounded-full font-label-md text-label-md transition-colors ${
              activeCategory === category
                ? "bg-primary-container text-on-primary shadow-sm"
                : "bg-surface-container-lowest border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Package Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-error bg-error-container/10 rounded-xl p-6 border border-error/20">
          <p>{error}</p>
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm">
          <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">
            sentiment_dissatisfied
          </span>
          <h3 className="text-lg font-semibold text-on-surface mb-2">
            No packages found
          </h3>
          <p className="text-on-surface-variant">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              isCompared={comparedIds.includes(pkg.id)}
              onCompareToggle={onCompareToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
