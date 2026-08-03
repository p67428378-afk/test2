import React from "react";
import { Bus, Navigation, MapPin, Activity } from "lucide-react";

export default function KPIGrid({ stats = {} }) {
  const kpis = [
    {
      label: "Active Buses",
      value: stats.activeBuses || 0,
      icon: Bus,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Total Routes",
      value: stats.totalRoutes || 0,
      icon: Navigation,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      label: "Active Stops",
      value: stats.activeStops || 0,
      icon: MapPin,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "System Status",
      value: stats.status || "Healthy",
      icon: Activity,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div
            key={index}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-lg hover:border-slate-700 transition-colors"
          >
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {kpi.label}
              </p>
              <p className="text-2xl font-black text-slate-100 mt-1.5 font-mono">
                {kpi.value}
              </p>
            </div>
            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center border ${kpi.color}`}
            >
              <Icon className="h-6 w-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
