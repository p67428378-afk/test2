import React from "react";
import { MapPin, Bus, Navigation } from "lucide-react";

export default function InteractiveMap({
  stops = [],
  buses = [],
  selectedStop = null,
  onSelectStop = () => {},
  selectedBus = null,
  onSelectBus = () => {},
}) {
  // Projection function to map lat/lon to SVG coordinates (800x500)
  const project = (lat, lon) => {
    const minLat = 40.7;
    const maxLat = 40.79;
    const minLon = -74.02;
    const maxLon = -73.96;

    const x = 50 + ((lon - minLon) / (maxLon - minLon)) * 700;
    const y = 450 - ((lat - minLat) / (maxLat - minLat)) * 400;
    return { x, y };
  };

  // Generate path data for the route line
  const getRoutePath = () => {
    if (stops.length < 2) return "";
    return stops
      .map((stop, index) => {
        const { x, y } = project(
          stop.location.latitude,
          stop.location.longitude,
        );
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  return (
    <div className="relative w-full h-[500px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-inner flex flex-col">
      {/* Map Header / Legend */}
      <div className="absolute top-4 left-4 z-10 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-xl p-3 text-xs space-y-2 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-indigo-500 inline-block"></span>
          <span className="text-slate-300 font-medium">Bus Route Path</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-emerald-400" />
          <span className="text-slate-300 font-medium">
            Bus Stop (Click for ETA)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Bus className="h-4 w-4 text-amber-400" />
          <span className="text-slate-300 font-medium">
            Active Bus (Live Location)
          </span>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="flex-1 relative overflow-auto p-4 flex items-center justify-center">
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full max-h-[460px] text-slate-700"
          style={{ minWidth: "600px" }}
        >
          {/* Grid lines for map feel */}
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#1e293b"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Route Path Line */}
          {stops.length >= 2 && (
            <path
              d={getRoutePath()}
              fill="none"
              stroke="#6366f1"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-pulse"
              strokeDasharray="8 4"
            />
          )}

          {/* Render Stops */}
          {stops.map((stop) => {
            const { x, y } = project(
              stop.location.latitude,
              stop.location.longitude,
            );
            const isSelected = selectedStop?.id === stop.id;
            return (
              <g
                key={stop.id}
                className="cursor-pointer group"
                onClick={() => onSelectStop(stop)}
              >
                {/* Outer glow for selected stop */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="16"
                    className="fill-emerald-500/20 stroke-emerald-500/40 stroke-2 animate-ping"
                  />
                )}
                {/* Hover ring */}
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  className="fill-transparent stroke-transparent group-hover:stroke-slate-500 group-hover:fill-slate-800/30 transition-all"
                  strokeWidth="2"
                />
                {/* Stop marker circle */}
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  className={`${
                    isSelected
                      ? "fill-emerald-400 stroke-emerald-200"
                      : "fill-slate-400 stroke-slate-600"
                  } transition-colors`}
                  strokeWidth="2"
                />
                {/* Stop Name Label */}
                <text
                  x={x}
                  y={y - 14}
                  textAnchor="middle"
                  className={`text-[10px] font-semibold select-none ${
                    isSelected
                      ? "fill-emerald-400 font-bold"
                      : "fill-slate-400 group-hover:fill-slate-200"
                  } transition-colors`}
                >
                  {stop.stop_name}
                </text>
              </g>
            );
          })}

          {/* Render Buses */}
          {buses.map((bus) => {
            if (!bus.location) return null;
            const { x, y } = project(
              bus.location.latitude,
              bus.location.longitude,
            );
            const isSelected = selectedBus?.id === bus.id;
            return (
              <g
                key={bus.id}
                className="cursor-pointer group"
                onClick={() => onSelectBus(bus)}
              >
                {/* Outer glow for selected bus */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="20"
                    className="fill-amber-500/20 stroke-amber-500/40 stroke-2 animate-pulse"
                  />
                )}
                {/* Bus marker background */}
                <circle
                  cx={x}
                  cy={y}
                  r="10"
                  className={`${
                    isSelected
                      ? "fill-amber-400 stroke-amber-200"
                      : "fill-amber-500 stroke-amber-600"
                  } transition-colors`}
                  strokeWidth="2"
                />
                {/* Bus Icon representation */}
                <circle cx={x} cy={y} r="4" fill="#0f172a" />
                {/* Bus Label */}
                <text
                  x={x}
                  y={y + 22}
                  textAnchor="middle"
                  className={`text-[10px] font-bold select-none ${
                    isSelected
                      ? "fill-amber-400"
                      : "fill-amber-500 group-hover:fill-amber-300"
                  } transition-colors`}
                >
                  {bus.vehicle_id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
