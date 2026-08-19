import React from "react";

export default function StatCard({
  title,
  value,
  badgeText,
  badgeVariant = "success",
  icon: Icon,
}) {
  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-5 shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#707a8c] uppercase tracking-wider">
          {title}
        </span>
        {Icon && <Icon className="w-5 h-5 text-[#2663eb]" />}
      </div>
      <div className="flex items-baseline justify-between mt-1">
        <span className="text-2xl font-bold text-[#171c29]">{value}</span>
        {badgeText && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              badgeVariant === "success"
                ? "bg-emerald-100 text-[#17a34a]"
                : badgeVariant === "warning"
                  ? "bg-amber-100 text-[#eb9917]"
                  : badgeVariant === "danger"
                    ? "bg-red-100 text-[#dc2626]"
                    : "bg-blue-100 text-[#2663eb]"
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
