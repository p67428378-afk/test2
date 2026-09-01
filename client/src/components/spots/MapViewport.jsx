import React, { useState } from "react";
import { MapPin, Navigation, Compass, Layers, Zap, Info } from "lucide-react";

export default function MapViewport({
  spots = [],
  selectedSpotId,
  onSelectSpot,
}) {
  const [zoomLevel, setZoomLevel] = useState(14);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 text-white overflow-hidden flex flex-col h-[520px] shadow-lg relative">
      {/* Map Control Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 text-xs flex items-center gap-3">
        <span className="flex items-center gap-1.5 font-semibold text-blue-400">
          <Compass className="w-4 h-4 animate-spin-slow text-blue-400" />
          Interactive Spatial Map
        </span>
        <span className="text-slate-500">|</span>
        <span className="text-slate-300">{spots.length} spots rendered</span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
          className="w-8 h-8 bg-slate-900/90 border border-slate-700 hover:bg-slate-800 rounded-lg flex items-center justify-center text-sm font-bold text-slate-200"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(z - 1, 10))}
          className="w-8 h-8 bg-slate-900/90 border border-slate-700 hover:bg-slate-800 rounded-lg flex items-center justify-center text-sm font-bold text-slate-200"
          title="Zoom Out"
        >
          -
        </button>
      </div>

      {/* Simulated Visual Interactive Canvas Grid */}
      <div className="relative flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 overflow-hidden flex items-center justify-center">
        {/* Map Grid Lines */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(#38bdf8 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)",
            backgroundSize: "24px 24px, 48px 48px, 48px 48px",
          }}
        />

        {/* Center Target Indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border border-blue-500/20 animate-ping absolute" />
          <div className="w-16 h-16 rounded-full border border-blue-500/40 flex items-center justify-center">
            <Navigation className="w-6 h-6 text-blue-400 rotate-45" />
          </div>
          <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800/50 mt-1 font-mono">
            Search Center
          </span>
        </div>

        {/* Render Spot Markers */}
        <div className="relative w-full h-full max-w-2xl max-h-[400px]">
          {spots.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 text-sm">
              <MapPin className="w-10 h-10 text-slate-700 mb-2" />
              <p>No parking spots found in this area.</p>
              <p className="text-xs text-slate-600 mt-1">
                Try expanding search radius or adjusting filters.
              </p>
            </div>
          ) : (
            spots.map((spot, index) => {
              const spotId = spot.spot_id || spot.id;
              const isSelected = spotId === selectedSpotId;
              const isAvailable =
                (spot.status || "AVAILABLE").toUpperCase() === "AVAILABLE" &&
                (spot.available_spots ?? 1) > 0;

              // Scatter markers pseudo-geospatially around canvas based on index
              const angle = (index / Math.max(1, spots.length)) * 2 * Math.PI;
              const radiusPercent = 25 + (index % 3) * 12;
              const left = 50 + Math.cos(angle) * radiusPercent;
              const top = 50 + Math.sin(angle) * radiusPercent;

              return (
                <div
                  key={spotId || index}
                  onClick={() => onSelectSpot && onSelectSpot(spotId)}
                  style={{ left: `${left}%`, top: `${top}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group z-20 ${
                    isSelected ? "scale-125 z-30" : "hover:scale-110"
                  }`}
                >
                  {/* Map Pin Pulse */}
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-lg border flex items-center gap-1.5 whitespace-nowrap transition ${
                        isAvailable
                          ? isSelected
                            ? "bg-emerald-500 text-slate-950 border-white ring-4 ring-emerald-500/30"
                            : "bg-emerald-950 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900"
                          : "bg-red-950 text-red-300 border-red-500/50 hover:bg-red-900"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isAvailable ? "bg-emerald-400" : "bg-red-400"
                        }`}
                      />
                      <span>
                        $
                        {spot.hourly_rate
                          ? spot.hourly_rate.toFixed(2)
                          : "0.00"}
                      </span>
                      {spot.has_ev_charging && (
                        <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                      )}
                    </div>

                    {/* Pin tail */}
                    <div
                      className={`w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent ${
                        isAvailable
                          ? "border-t-emerald-500"
                          : "border-t-red-500"
                      }`}
                    />

                    {/* Popup Card on Hover / Selection */}
                    {isSelected && (
                      <div className="absolute bottom-full mb-2 bg-slate-900 border border-blue-500/60 rounded-xl p-3 shadow-2xl text-xs w-48 text-left z-40 backdrop-blur-md">
                        <div className="font-bold text-white text-sm truncate">
                          {spot.name}
                        </div>
                        <div className="text-slate-400 text-[11px] truncate mb-2">
                          {spot.address}
                        </div>
                        <div className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800">
                          <span className="text-slate-400">Open Spots:</span>
                          <span className="font-bold text-emerald-400">
                            {spot.available_spots ?? 0} /{" "}
                            {spot.total_capacity ?? 50}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Map Legend Footer */}
      <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Available Spots</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>Full / Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>EV Station</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-500">
          PostGIS Spatial Engine • Zoom Level: {zoomLevel}x
        </div>
      </div>
    </div>
  );
}
