import React from "react";
import { MapPin, Zap, Clock, ChevronRight, ShieldCheck } from "lucide-react";

export default function SpotCard({ spot, onSelect, isSelected = false }) {
  const {
    spot_id,
    id,
    name,
    address,
    distance_km,
    hourly_rate,
    status,
    total_capacity,
    available_spots,
    spot_type,
    has_ev_charging,
    is_peak_hours,
  } = spot;

  const actualId = spot_id || id;
  const isAvailable =
    (status || "AVAILABLE").toUpperCase() === "AVAILABLE" &&
    (available_spots ?? 1) > 0;
  const fillPercentage = total_capacity
    ? Math.round(
        ((total_capacity - (available_spots ?? 0)) / total_capacity) * 100,
      )
    : 50;

  return (
    <div
      className={`bg-white rounded-xl border p-5 transition-all shadow-sm hover:shadow-md ${
        isSelected
          ? "border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20"
          : "border-slate-200"
      }`}
    >
      <div className="flex justify-between items-start gap-3 mb-2">
        <div>
          <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition">
            {name}
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{address}</span>
            {distance_km !== undefined && (
              <span className="ml-1 font-semibold text-blue-700">
                • {distance_km.toFixed(2)} km away
              </span>
            )}
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="text-xl font-extrabold text-blue-800">
            ${hourly_rate ? hourly_rate.toFixed(2) : "0.00"}
            <span className="text-xs font-normal text-slate-500">/hr</span>
          </div>
          {is_peak_hours && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-semibold rounded-full">
              Peak Rate
            </span>
          )}
        </div>
      </div>

      {/* Badges & Amenities */}
      <div className="flex flex-wrap gap-2 my-3">
        <span
          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${
            isAvailable
              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isAvailable ? "bg-emerald-500 animate-pulse" : "bg-red-500"
            }`}
          />
          {isAvailable ? "Available" : "Occupied / Full"}
        </span>

        <span className="capitalize text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
          {spot_type ? spot_type.replace("_", " ") : "Garage"}
        </span>

        {has_ev_charging && (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
            EV Charging
          </span>
        )}
      </div>

      {/* Capacity Progress Bar */}
      <div className="space-y-1 mb-4">
        <div className="flex justify-between text-xs font-medium text-slate-600">
          <span>Real-Time Availability</span>
          <span className="font-bold text-slate-900">
            {available_spots ?? 0} of {total_capacity ?? 50} spots open
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              fillPercentage > 85
                ? "bg-red-500"
                : fillPercentage > 60
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            }`}
            style={{
              width: `${Math.min(100, Math.max(5, 100 - fillPercentage))}%`,
            }}
          />
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Verified sensor feed
        </span>

        <button
          onClick={() => onSelect && onSelect(actualId)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
        >
          <span>View Rates & Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
