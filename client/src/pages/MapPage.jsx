import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getMapData, getAnimals } from "../services/api";
import InteractiveMap from "../components/map/InteractiveMap";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import { Compass, AlertCircle, Info, X } from "lucide-react";

const MapPage = ({ onSelectAnimal }) => {
  const [mapData, setMapData] = useState({
    enclosures: [],
    facilities: [],
    paths: [],
  });
  const [animals, setAnimals] = useState([]);
  const [selectedEnclosure, setSelectedEnclosure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [mData, animalsData] = await Promise.all([
          getMapData(),
          getAnimals(),
        ]);
        setMapData(mData);
        setAnimals(animalsData);
        setError(null);
      } catch (err) {
        console.error("Error loading map page data:", err);
        setError("Failed to load map data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get animals in the selected enclosure
  const enclosureAnimals = selectedEnclosure
    ? animals.filter((a) => a.enclosure_id === selectedEnclosure.id)
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Map Area */}
      <div className="lg:col-span-2 h-full">
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-xl h-full flex items-center justify-center animate-pulse">
            <span className="text-slate-400">Loading map...</span>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-xl h-full flex flex-col items-center justify-center text-rose-700 gap-2">
            <AlertCircle className="w-8 h-8" />
            <p>{error}</p>
          </div>
        ) : (
          <InteractiveMap
            enclosures={mapData.enclosures}
            facilities={mapData.facilities}
            paths={mapData.paths}
            onSelectEnclosure={setSelectedEnclosure}
          />
        )}
      </div>

      {/* Sidebar Panel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-full overflow-hidden">
        {selectedEnclosure ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {selectedEnclosure.name}
                </h3>
                <span className="text-xs text-slate-500">
                  Enclosure Details
                </span>
              </div>
              <button
                onClick={() => setSelectedEnclosure(null)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedEnclosure.description ||
                  "No description available for this enclosure."}
              </p>
            </div>

            {/* Animals in Enclosure */}
            <div className="flex-1 overflow-y-auto">
              <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-primary" />
                Animals Here ({enclosureAnimals.length})
              </h4>

              {enclosureAnimals.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No animals currently assigned to this enclosure.
                </p>
              ) : (
                <div className="space-y-3">
                  {enclosureAnimals.map((animal) => (
                    <div
                      key={animal.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between hover:bg-slate-100/80 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {animal.name}
                        </p>
                        <p className="text-xs text-slate-500 italic">
                          {animal.species}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="text-xs py-1 px-2.5 flex items-center gap-1"
                        onClick={() => onSelectAnimal(animal)}
                      >
                        <Info className="w-3 h-3" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
            <Compass className="w-12 h-12 mb-3 stroke-1 text-slate-300" />
            <p className="text-sm font-medium">
              Select an enclosure on the map
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Click any pin to view details and animals residing there.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

MapPage.propTypes = {
  onSelectAnimal: PropTypes.func.isRequired,
};

export default MapPage;
