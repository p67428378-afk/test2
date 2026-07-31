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
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-center justify-between">
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-slate-100">{value}</span>
          {trend && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${trendColors[trendType]}`}
            >
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className="h-12 w-12 rounded-xl bg-slate-700/50 flex items-center justify-center text-emerald-400 border border-slate-700">
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}
