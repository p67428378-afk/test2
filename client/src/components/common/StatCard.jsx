import React from "react";

export default function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  badgeText,
  badgeVariant = "default",
  trend,
}) {
  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-5 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#707a8c]">
          {label}
        </span>
        {Icon && (
          <div className="p-2 bg-[#f7fafc] rounded-lg text-[#2663eb]">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-bold text-[#171c29]">{value}</span>
        {badgeText && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              badgeVariant === "success"
                ? "bg-green-50 text-[#17a34a]"
                : badgeVariant === "warning"
                  ? "bg-amber-50 text-[#eb9917]"
                  : badgeVariant === "danger"
                    ? "bg-red-50 text-[#db2626]"
                    : "bg-gray-100 text-gray-700"
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>
      {subtext && <p className="mt-1 text-xs text-[#707a8c]">{subtext}</p>}
    </div>
  );
}
