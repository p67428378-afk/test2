import React from "react";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
}) {
  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-100",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-100",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-100",
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white border border-[#E3E8F0] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[#707A8C] uppercase tracking-wider">
          {title}
        </p>
        {Icon && (
          <div
            className={`w-9 h-9 rounded-lg ${scheme.bg} ${scheme.text} flex items-center justify-center shrink-0`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold text-[#171C29] tracking-tight">
          {value}
        </p>
        {subtitle && <p className="text-xs text-[#707A8C] mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
