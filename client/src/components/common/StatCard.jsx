import React from "react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeVariant = "success",
  iconColor = "text-[#1466bf]",
  iconBg = "bg-blue-50",
}) {
  return (
    <div className="bg-white p-5 rounded-xl border border-[#dee3ed] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-[#6b758a]">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${iconBg} ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl lg:text-3xl font-bold text-[#171f2e]">
            {value}
          </span>
          {badgeText && (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                badgeVariant === "success"
                  ? "bg-emerald-50 text-[#149e52]"
                  : badgeVariant === "warning"
                    ? "bg-amber-50 text-[#eb941a]"
                    : "bg-blue-50 text-[#1466bf]"
              }`}
            >
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-[#6b758a] mt-1.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
