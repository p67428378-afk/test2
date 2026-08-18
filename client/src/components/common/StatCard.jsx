import React from "react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeColor = "bg-blue-100 text-blue-800",
}) {
  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-5 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-[#707a8c]">{title}</span>
        {Icon && (
          <div className="p-2 rounded-lg bg-[#f7fafc] text-[#2663eb]">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#171c29]">{value}</span>
          {badgeText && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}
            >
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-[#707a8c] mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
