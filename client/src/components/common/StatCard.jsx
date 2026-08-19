import React from "react";

export default function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  color = "blue",
}) {
  const colorMap = {
    blue: "bg-blue-50 text-[#2663eb] border-blue-100",
    green: "bg-green-50 text-[#17a34a] border-green-100",
    amber: "bg-amber-50 text-[#eb9917] border-amber-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-lg p-5 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-xs font-medium text-[#707a8c] uppercase tracking-wider mb-1">
          {label}
        </p>

        <h3 className="text-2xl font-bold text-[#171c29]">{value}</h3>
        {subtext && <p className="text-xs text-[#707a8c] mt-1">{subtext}</p>}
      </div>
      {Icon && (
        <div
          className={`p-3 rounded-lg border ${colorMap[color] || colorMap.blue}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
