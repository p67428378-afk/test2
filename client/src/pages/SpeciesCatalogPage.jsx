import React, { useState, useEffect } from "react";
import SpeciesCard from "../components/species/SpeciesCard.jsx";
import AddCustomSpeciesModal from "../components/species/AddCustomSpeciesModal.jsx";
import AddPlantModal from "../components/garden/AddPlantModal.jsx";
import { getSpeciesList } from "../services/api.js";
import {
  Search,
  Plus,
  BookOpen,
  RefreshCw,
  AlertCircle,
  Filter,
} from "lucide-react";

export default function SpeciesCatalogPage() {
  const [speciesList, setSpeciesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [sunlightFilter, setSunlightFilter] = useState("All");

  const [isAddSpeciesModalOpen, setIsAddSpeciesModalOpen] = useState(false);
  const [selectedSpeciesForGarden, setSelectedSpeciesForGarden] =
    useState(null);
  const [isAddPlantModalOpen, setIsAddPlantModalOpen] = useState(false);

  const fetchSpecies = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getSpeciesList(searchQuery);
      setSpeciesList(data || []);
    } catch (err) {
      console.error("Failed to load species catalog:", err);
      setError(
        err.response?.data?.detail || "Failed to fetch species catalog.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecies();
  }, [searchQuery]);

  const handleAddToGarden = (species) => {
    setSelectedSpeciesForGarden(species);
    setIsAddPlantModalOpen(true);
  };

  const filteredSpecies = speciesList.filter((species) => {
    if (sunlightFilter === "All") return true;
    return species.sunlight_requirement
      ?.toLowerCase()
      .includes(sunlightFilter.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-[#1C8A5C]" />
            <span>Botanical Species Catalog & Care Guides</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Browse plant care guides, light & humidity needs, or register custom
            species
          </p>
        </div>

        <button
          onClick={() => setIsAddSpeciesModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-[#1C8A5C] text-white font-semibold text-sm rounded-xl hover:bg-[#0F4E34] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Custom Species</span>
        </button>
      </div>

      {/* Search & Sunlight Filter Chips */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder='Search by common name (e.g. "Monstera") or scientific name...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1C8A5C] focus:bg-white transition-all"
            />
          </div>

          <button
            onClick={fetchSpecies}
            className="p-2 border border-gray-200 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-50"
            title="Refresh Catalog"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Sunlight Requirement Chips */}
        <div className="flex items-center space-x-2 text-xs pt-1 overflow-x-auto">
          <span className="text-gray-400 font-medium flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Light:
          </span>
          {["All", "Direct", "Bright Indirect", "Medium", "Low Light"].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => setSunlightFilter(tag)}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  sunlightFilter === tag
                    ? "bg-[#1C8A5C] text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ),
          )}
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16">
          <RefreshCw className="w-8 h-8 text-[#1C8A5C] animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500 font-medium">
            Loading botanical care guides...
          </p>
        </div>
      ) : filteredSpecies.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center max-w-md mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#1C8A5C] flex items-center justify-center mx-auto mb-3 text-xl">
            🔍
          </div>
          <h3 className="font-bold text-gray-900 text-base mb-1">
            No species found
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Unrecognized species name? You can register a custom species with
            your own care parameters!
          </p>
          <button
            onClick={() => setIsAddSpeciesModalOpen(true)}
            className="px-4 py-2 bg-[#1C8A5C] text-white text-xs font-semibold rounded-lg hover:bg-[#0F4E34] transition-colors"
          >
            + Register Custom Species
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpecies.map((species) => (
            <SpeciesCard
              key={species.id}
              species={species}
              onAddToGarden={handleAddToGarden}
            />
          ))}
        </div>
      )}

      {isAddSpeciesModalOpen && (
        <AddCustomSpeciesModal
          onClose={() => setIsAddSpeciesModalOpen(false)}
          onSuccess={fetchSpecies}
        />
      )}

      {isAddPlantModalOpen && (
        <AddPlantModal
          plantToEdit={
            selectedSpeciesForGarden
              ? {
                  species_id: selectedSpeciesForGarden.id,
                  nickname: selectedSpeciesForGarden.common_name,
                }
              : null
          }
          onClose={() => {
            setIsAddPlantModalOpen(false);
            setSelectedSpeciesForGarden(null);
          }}
          onSuccess={() =>
            alert(
              `Added ${selectedSpeciesForGarden?.common_name} to your garden!`,
            )
          }
        />
      )}
    </div>
  );
}
