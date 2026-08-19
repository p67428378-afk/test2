import React from "react";

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  badgeText,
  badgeColor = "bg-blue-50 text-blue-700",
}) {
  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-5 shadow-sm flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#707a8c] mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-[#171c29]">{value}</h3>
        </div>
        {Icon && (
          <div className="p-2.5 bg-blue-50 rounded-lg text-[#1f40b0]">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtext || badgeText) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {badgeText && (
            <span
              className={`px-2 py-0.5 rounded-full font-medium ${badgeColor}`}
            >
              {badgeText}
            </span>
          )}
          {subtext && <span className="text-[#707a8c]">{subtext}</span>}
        </div>
      )}
    </div>
  );
}
