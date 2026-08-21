import React from "react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color = "primary",
}) {
  const colorMap = {
    primary: {
      bg: "bg-[#e8f4f8]",
      text: "text-[#1485b8]",
    },
    success: {
      bg: "bg-green-100",
      text: "text-[#149e52]",
    },
    warning: {
      bg: "bg-amber-100",
      text: "text-[#eb9414]",
    },
    error: {
      bg: "bg-red-100",
      text: "text-[#db2727]",
    },
  };

  const selectedColor = colorMap[color] || colorMap.primary;

  return (
    <div className="bg-white p-5 rounded-xl border border-[#e0e8f0] shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-[#6b7a8f] uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-[#171f2e]">{value}</h3>
        {trendLabel && (
          <p className="text-xs text-[#6b7a8f] mt-1 flex items-center gap-1">
            {trend && (
              <span className="font-semibold text-[#149e52]">{trend}</span>
            )}
            <span>{trendLabel}</span>
          </p>
        )}
      </div>

      {Icon && (
        <div
          className={`p-3 rounded-lg ${selectedColor.bg} ${selectedColor.text}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
