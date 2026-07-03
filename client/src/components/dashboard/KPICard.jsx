import React from "react";

export default function KPICard({
  title,
  value,
  unit = "",
  icon: Icon,
  trend,
  trendType = "neutral",
  description,
}) {
  const trendColors = {
    positive: "text-emerald-600 bg-emerald-50 border-emerald-100",
    negative: "text-red-600 bg-red-50 border-red-100",
    neutral: "text-slate-600 bg-slate-50 border-slate-100",
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">
            {value}
            {unit && (
              <span className="text-lg font-medium text-slate-500 ml-1">
                {unit}
              </span>
            )}
          </h3>
        </div>
        {Icon && (
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
        {description && <p className="text-xs text-slate-400">{description}</p>}
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${trendColors[trendType]}`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
