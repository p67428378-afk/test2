import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { searchCities } from "../../services/api";

export default function SearchBar({ onSelectCity }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await searchCities(query);
      setResults(data);
    } catch (err) {
      console.error(err);
      setError("Failed to search cities. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (city) => {
    onSelectCity(city);
    setQuery("");
    setResults([]);
    setSearched(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-8 relative">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a city (e.g., Seattle, London)..."
            className="w-full px-4 py-2.5 pl-10 bg-white border border-[#e3e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2663eb] focus:border-transparent text-sm"
          />
          <Search className="absolute left-3 top-3 size-4 text-[#707a8c]" />
        </div>
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="bg-[#2663eb] hover:bg-[#1d4ed8] disabled:bg-[#93c5fd] text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Search"}
        </button>
      </form>

      {/* Search Results Dropdown */}
      {searched && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-[#e3e8f0] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-[#707a8c] flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin text-[#2663eb]" />
              Searching cities...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-sm text-red-500">{error}</div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-sm text-[#707a8c]">
              City not found
            </div>
          ) : (
            <ul className="divide-y divide-[#e3e8f0]">
              {results.map((city) => (
                <li key={city.id}>
                  <button
                    onClick={() => handleSelect(city)}
                    className="w-full text-left px-4 py-3 hover:bg-[#f8fafc] text-sm transition-colors flex flex-col"
                  >
                    <span className="font-semibold text-[#171c29]">
                      {city.name}
                      {city.state ? `, ${city.state}` : ""}
                    </span>
                    <span className="text-xs text-[#707a8c]">
                      {city.country}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
