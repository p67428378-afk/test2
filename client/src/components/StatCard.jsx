import React from "react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendType = "neutral",
}) {
  const trendColors = {
    positive: "text-emerald-400 bg-emerald-500/10",
    negative: "text-rose-400 bg-rose-500/10",
    neutral: "text-slate-400 bg-slate-500/10",
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center justify-between">
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <h3 className="text-3xl font-bold text-slate-100">{value}</h3>
        {trend && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${trendColors[trendType]}`}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="p-4 bg-slate-800 rounded-lg text-emerald-400">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}
