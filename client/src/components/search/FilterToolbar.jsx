import React from "react";
import {
  Filter,
  SlidersHorizontal,
  Zap,
  DollarSign,
  MapPin,
} from "lucide-react";

export default function FilterToolbar({ filters, onChange, onReset }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filters & Sorting</span>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Reset All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Radius */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Search Radius
          </label>
          <select
            value={filters.radius_km || 5}
            onChange={(e) =>
              handleChange("radius_km", parseFloat(e.target.value))
            }
            className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value={1}>1 km (Walking)</option>
            <option value={2}>2 km</option>
            <option value={5}>5 km (Default)</option>
            <option value={10}>10 km</option>
            <option value={25}>25 km</option>
          </select>
        </div>

        {/* Max Hourly Rate */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Max Rate: {filters.max_rate ? `$${filters.max_rate}/hr` : "Any"}
          </label>
          <select
            value={filters.max_rate || ""}
            onChange={(e) =>
              handleChange(
                "max_rate",
                e.target.value ? parseFloat(e.target.value) : null,
              )
            }
            className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="">Any Rate</option>
            <option value={3}>Under $3.00/hr</option>
            <option value={5}>Under $5.00/hr</option>
            <option value={8}>Under $8.00/hr</option>
            <option value={12}>Under $12.00/hr</option>
            <option value={20}>Under $20.00/hr</option>
          </select>
        </div>

        {/* Spot Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Spot Facility Type
          </label>
          <select
            value={filters.spot_type || ""}
            onChange={(e) => handleChange("spot_type", e.target.value || null)}
            className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="garage">Garage / Structure</option>
            <option value="covered">Covered Lot</option>
            <option value="open_lot">Surface Lot</option>
            <option value="street">Street Parking</option>
          </select>
        </div>

        {/* EV Charging Toggle */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Amenities & Features
          </label>
          <label className="flex items-center gap-2 p-2 border border-slate-300 rounded-lg text-xs cursor-pointer hover:bg-slate-50 transition">
            <input
              type="checkbox"
              checked={!!filters.has_ev_charging}
              onChange={(e) =>
                handleChange("has_ev_charging", e.target.checked || null)
              }
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-slate-700 font-medium">EV Charging Only</span>
          </label>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Sort Results By
          </label>
          <select
            value={filters.sort_by || "distance"}
            onChange={(e) => handleChange("sort_by", e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="distance">Distance (Nearest)</option>
            <option value="price">Hourly Rate (Lowest)</option>
            <option value="capacity">Available Spots (Highest)</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
