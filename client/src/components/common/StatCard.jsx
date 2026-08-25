import React from "react";
import Badge from "./Badge";

export default function StatCard({
  title,
  value,
  badgeText,
  badgeVariant = "success",
  subtitle,
  icon: Icon,
  className = "",
}) {
  return (
    <div
      className={`bg-white border border-[#e3e8f0] rounded-xl p-5 shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-[#707a8c] uppercase tracking-wider">
          {title}
        </p>
        {Icon && (
          <div className="p-2 bg-[#f2f5fa] rounded-lg text-[#2663eb]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <p className="text-2xl font-bold text-[#171c29] tracking-tight">
          {value}
        </p>
        {badgeText && <Badge variant={badgeVariant}>{badgeText}</Badge>}
      </div>

      {subtitle && <p className="text-xs text-[#707a8c] mt-2">{subtitle}</p>}
    </div>
  );
}
