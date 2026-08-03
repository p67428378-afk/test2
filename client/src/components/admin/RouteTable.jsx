import React from "react";
import { Bus, MapPin, ArrowRight, AlertCircle } from "lucide-react";

export default function RouteTable({
  routes = [],
  onSelectRoute = () => {},
  loading = false,
  error = null,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-slate-100 font-bold text-base">
          All Transit Routes
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          {routes.length} Routes Configured
        </span>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
            <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Loading routes table...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-rose-400 text-sm flex items-center justify-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        ) : routes.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Route Number</th>
                <th className="py-4 px-6">Route Name</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {routes.map((route) => (
                <tr
                  key={route.id}
                  className="hover:bg-slate-800/20 transition-colors"
                >
                  <td className="py-4 px-6 font-bold text-indigo-400 font-mono">
                    {route.route_number}
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-200">
                    {route.route_name}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => onSelectRoute(route)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      View Details
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12 text-slate-500 text-sm">
            No routes configured in the system.
          </div>
        )}
      </div>
    </div>
  );
}
