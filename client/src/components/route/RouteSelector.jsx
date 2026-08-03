import React, { useState } from "react";
import { Search, Bus, ArrowRight, AlertCircle } from "lucide-react";

export default function RouteSelector({
  routes = [],
  selectedRoute = null,
  onSelectRoute = () => {},
  loading = false,
  error = null,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter routes locally based on search query
  const filteredRoutes = routes.filter(
    (route) =>
      route.route_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.route_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-full min-h-[350px]">
      <h3 className="text-slate-100 font-bold text-base mb-4 flex items-center gap-2">
        <Bus className="h-5 w-5 text-indigo-400" />
        Select Bus Route
      </h3>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search route number or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
        />
      </div>

      {/* Route List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
            <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Loading routes...</span>
          </div>
        ) : error ? (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : filteredRoutes.length > 0 ? (
          filteredRoutes.map((route) => {
            const isSelected = selectedRoute?.id === route.id;
            return (
              <button
                key={route.id}
                onClick={() => onSelectRoute(route)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-400 shadow-lg shadow-indigo-500/5"
                    : "bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/40 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-9 w-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      isSelected
                        ? "bg-indigo-500 text-slate-100"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {route.route_number}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-200 truncate">
                      {route.route_name}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Active Route
                    </p>
                  </div>
                </div>
                <ArrowRight
                  className={`h-4 w-4 flex-shrink-0 transition-transform ${
                    isSelected
                      ? "text-indigo-400 translate-x-1"
                      : "text-slate-600"
                  }`}
                />
              </button>
            );
          })
        ) : (
          <div className="text-center py-12 text-slate-500 text-xs">
            No routes found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}
