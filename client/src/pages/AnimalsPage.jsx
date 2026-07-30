import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Compass, Search, AlertCircle, Filter } from "lucide-react";
import { getAnimals, getEnclosures } from "../services/api";
import AnimalCard from "../components/animals/AnimalCard";

const AnimalsPage = ({ onSelectAnimal, initialSearch = "" }) => {
  const [animals, setAnimals] = useState([]);
  const [enclosures, setEnclosures] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [selectedEnclosure, setSelectedEnclosure] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [animalsData, enclosuresData] = await Promise.all([
          getAnimals(),
          getEnclosures(),
        ]);
        setAnimals(animalsData);
        setEnclosures(enclosuresData);
        setError(null);
      } catch (err) {
        console.error("Error loading animals page data:", err);
        setError("Failed to load animals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter animals based on search query and selected enclosure
  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      animal.name.toLowerCase().includes(search.toLowerCase()) ||
      animal.species.toLowerCase().includes(search.toLowerCase());
    const matchesEnclosure = selectedEnclosure
      ? animal.enclosure_id === selectedEnclosure
      : true;
    return matchesSearch && matchesEnclosure;
  });

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by name or species..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150"
          />
        </div>

        {/* Enclosure Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedEnclosure}
            onChange={(e) => setSelectedEnclosure(e.target.value)}
            className="w-full sm:w-48 bg-slate-50 border border-slate-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-150"
          >
            <option value="">All Enclosures</option>
            {enclosures.map((enc) => (
              <option key={enc.id} value={enc.id}>
                {enc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Animals Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white border border-slate-200 rounded-xl h-80 animate-pulse"
            ></div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center text-rose-700 flex flex-col items-center gap-2">
          <AlertCircle className="w-8 h-8" />
          <p>{error}</p>
        </div>
      ) : filteredAnimals.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 flex flex-col items-center gap-3">
          <Compass className="w-12 h-12 text-slate-300 stroke-1" />
          <p className="text-lg font-medium">No animals found</p>
          <p className="text-sm text-slate-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnimals.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              onSelect={onSelectAnimal}
            />
          ))}
        </div>
      )}
    </div>
  );
};

AnimalsPage.propTypes = {
  onSelectAnimal: PropTypes.func.isRequired,
  initialSearch: PropTypes.string,
};

export default AnimalsPage;
