import React from "react";
import { Clock, MapPin, Bus, AlertCircle } from "lucide-react";

export default function StopDetailCard({ stop, etaData, loading, error }) {
  if (!stop) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center h-full min-h-[200px]">
        <MapPin className="h-10 w-10 text-slate-600 mb-3 animate-bounce" />
        <h3 className="text-slate-300 font-semibold text-base">
          No Stop Selected
        </h3>
        <p className="text-slate-500 text-xs mt-1 max-w-[240px]">
          Tap on any bus stop marker on the map to view upcoming arrival times
          and ETAs.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-full min-h-[200px] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
          <MapPin className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-slate-100 font-bold text-base leading-tight">
            {stop.stop_name}
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            Lat: {stop.location.latitude.toFixed(4)}, Lon:{" "}
            {stop.location.longitude.toFixed(4)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-6 text-slate-400 space-y-2">
            <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Fetching live ETAs...</span>
          </div>
        ) : error ? (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : etaData && etaData.etas && etaData.etas.length > 0 ? (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Upcoming Arrivals
            </h4>
            <div className="grid gap-3">
              {etaData.etas.map((eta, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                      <Bus className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-200">
                          Route {eta.route_number}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded font-mono">
                          {eta.vehicle_id}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        Dynamic calculation
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      {eta.estimated_arrival_minutes}
                    </span>
                    <span className="text-xs text-emerald-500 font-medium ml-1">
                      min
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 text-xs">
            No active buses currently scheduled for this stop.
          </div>
        )}
      </div>
    </div>
  );
}
