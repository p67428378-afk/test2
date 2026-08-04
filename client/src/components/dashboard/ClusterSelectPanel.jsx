import React from "react";
import {
  Store,
  MapPin,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

export default function ClusterSelectPanel() {
  const clusters = [
    {
      id: "small-town-value",
      name: "Small Town Value Cluster (#CL-8802)",
      stores: 1240,
      region: "Southeast & Midwest",
      salesPerFt: "$245.50",
      pbShare: "28.5%",
      status: "Active Target",
      isCurrent: true,
    },
    {
      id: "suburban-family",
      name: "Suburban Family Cluster (#CL-8803)",
      stores: 980,
      region: "Mid-Atlantic & Northeast",
      salesPerFt: "$280.10",
      pbShare: "24.0%",
      status: "Available",
      isCurrent: false,
    },
    {
      id: "metro-express",
      name: "Metro Express Cluster (#CL-8804)",
      stores: 450,
      region: "Urban Centers",
      salesPerFt: "$310.40",
      pbShare: "31.2%",
      status: "Available",
      isCurrent: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-2">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Store className="h-5 w-5 text-amber-500" />
          Cluster Selection & Store Configuration
        </h2>
        <p className="text-xs text-slate-400">
          Select store clusters to evaluate localized assortment advisor
          recommendations and telemetry performance metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {clusters.map((cluster) => (
          <div
            key={cluster.id}
            className={`p-5 rounded-xl border transition-all cursor-pointer ${
              cluster.isCurrent
                ? "bg-slate-800 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                : "bg-slate-800/60 border-slate-700 hover:border-slate-500"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-slate-100 text-sm">
                {cluster.name}
              </h3>
              {cluster.isCurrent && (
                <span className="bg-amber-500 text-slate-900 font-bold text-[10px] px-2 py-0.5 rounded-xs flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> ACTIVE
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  {cluster.region} ({cluster.stores} stores)
                </span>
              </div>

              <div className="border-t border-slate-700/50 pt-2 flex justify-between">
                <span className="text-slate-400">Sales / Linear Ft:</span>
                <span className="font-mono font-semibold text-slate-100">
                  {cluster.salesPerFt}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Private Brand Share:</span>
                <span className="font-mono font-semibold text-emerald-400">
                  {cluster.pbShare}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
