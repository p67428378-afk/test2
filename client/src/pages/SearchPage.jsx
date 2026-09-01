import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, RefreshCw, Layers, ShieldCheck, MapPin } from "lucide-react";
import SearchBar from "../components/search/SearchBar";
import FilterToolbar from "../components/search/FilterToolbar";
import SpotCard from "../components/spots/SpotCard";
import MapViewport from "../components/spots/MapViewport";
import { parkingService } from "../services/api";

export default function SearchPage() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    address: "123 Main St, San Francisco, CA",
    radius_km: 5,
    max_rate: null,
    spot_type: null,
    has_ev_charging: null,
    sort_by: "distance",
  });

  const [spots, setSpots] = useState([]);
  const [totalSpots, setTotalSpots] = useState(0);
  const [selectedSpotId, setSelectedSpotId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSpots = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await parkingService.searchSpots(searchParams);
      const spotList = data.spots || (Array.isArray(data) ? data : []);
      setSpots(spotList);
      setTotalSpots(data.total !== undefined ? data.total : spotList.length);
      if (spotList.length > 0 && !selectedSpotId) {
        setSelectedSpotId(spotList[0].spot_id || spotList[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch parking spots:", err);
      setError(
        "Unable to search parking spots. Please check connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpots();
  }, [searchParams]);

  const handleSelectSpot = (spotId) => {
    setSelectedSpotId(spotId);
    navigate(`/spots/${spotId}`);
  };

  const handleResetFilters = () => {
    setSearchParams({
      address: "123 Main St, San Francisco, CA",
      radius_km: 5,
      max_rate: null,
      spot_type: null,
      has_ev_charging: null,
      sort_by: "distance",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap justify-between items-center sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-md">
            P
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-blue-900 tracking-tight">
              ParkFind Locator
            </h1>
            <p className="text-[11px] text-slate-500">
              Real-Time Open Spots & Rate Tracker
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-6 text-sm font-semibold">
          <Link
            to="/"
            className="text-blue-700 border-b-2 border-blue-700 py-1"
          >
            Search Map
          </Link>
          <Link
            to="/monitor"
            className="text-slate-600 hover:text-blue-700 transition py-1 flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Monitor
          </Link>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Search Bar Section */}
        <SearchBar
          onSearch={(query) =>
            setSearchParams((prev) => ({ ...prev, ...query }))
          }
          initialAddress={searchParams.address}
        />

        {/* Filters Toolbar */}
        <FilterToolbar
          filters={searchParams}
          onChange={setSearchParams}
          onReset={handleResetFilters}
        />

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={fetchSpots}
              className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Split-Pane Results View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Pane: Spots List */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex justify-between items-center text-sm font-medium text-slate-700">
              <span>
                Found{" "}
                <strong className="text-blue-900 font-bold">
                  {totalSpots}
                </strong>{" "}
                available parking locations
              </span>
              <button
                onClick={fetchSpots}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-44 bg-white border border-slate-200 rounded-xl animate-pulse p-4"
                  />
                ))}
              </div>
            ) : spots.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
                <MapPin className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">
                  No Spots Found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We couldn't find open parking matching your current filter
                  choices. Try expanding search radius or turning off max rate
                  filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-blue-700 text-white text-xs font-semibold rounded-lg hover:bg-blue-800"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {spots.map((spot) => {
                  const sId = spot.spot_id || spot.id;
                  return (
                    <SpotCard
                      key={sId}
                      spot={spot}
                      isSelected={sId === selectedSpotId}
                      onSelect={handleSelectSpot}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Pane: Interactive Map Viewport */}
          <div className="lg:col-span-6 sticky top-24">
            <MapViewport
              spots={spots}
              selectedSpotId={selectedSpotId}
              onSelectSpot={setSelectedSpotId}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-500 mt-12">
        <p>
          © 2026 ParkFind Locator System • Real-Time Spatial Parking
          Intelligence
        </p>
      </footer>
    </div>
  );
}
