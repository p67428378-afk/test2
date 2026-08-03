import React from "react";
import { MapPin, Clock, AlertCircle } from "lucide-react";

export default function RouteTimeline({
  stops = [],
  selectedStop = null,
  onSelectStop = () => {},
  loading = false,
  error = null,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-full min-h-[350px]">
      <h3 className="text-slate-100 font-bold text-base mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-indigo-400" />
        Route Stops & Timeline
      </h3>

      <div className="flex-1 overflow-y-auto pr-1 max-h-[300px] relative pl-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
            <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Loading timeline...</span>
          </div>
        ) : error ? (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : stops.length > 0 ? (
          <div className="relative border-l-2 border-slate-800 ml-3 space-y-6 py-2">
            {stops.map((stop, index) => {
              const isSelected = selectedStop?.id === stop.id;
              return (
                <div
                  key={stop.id}
                  onClick={() => onSelectStop(stop)}
                  className="relative pl-8 cursor-pointer group"
                >
                  {/* Timeline Node Dot */}
                  <div
                    className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 transition-all ${
                      isSelected
                        ? "bg-emerald-400 border-emerald-200 scale-125 shadow-lg shadow-emerald-500/20"
                        : "bg-slate-900 border-slate-700 group-hover:border-slate-500"
                    }`}
                  ></div>

                  {/* Stop Card */}
                  <div
                    className={`p-3 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-emerald-500/5 border-emerald-500/30 text-emerald-400"
                        : "bg-slate-950/30 border-slate-800/60 text-slate-300 hover:bg-slate-800/30 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-200 truncate group-hover:text-slate-100">
                          {stop.stop_name}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Stop #{stop.stop_order || index + 1}
                        </p>
                      </div>
                      <Clock
                        className={`h-4 w-4 flex-shrink-0 ${isSelected ? "text-emerald-400" : "text-slate-600"}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 text-xs">
            Select a route to view its stops timeline.
          </div>
        )}
      </div>
    </div>
  );
}
