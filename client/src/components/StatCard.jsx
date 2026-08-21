import React from "react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  colorClass = "text-primary bg-blue-50",
}) {
  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm flex items-center gap-4">
      <div className={`p-3.5 rounded-xl shrink-0 ${colorClass}`}>
        <Icon className="size-6" />
      </div>
      <div>
        <p className="text-text_secondary text-xs font-medium uppercase tracking-wider">
          {title}
        </p>
        <p className="text-2xl font-bold text-text_primary mt-1">{value}</p>
      </div>
    </div>
  );
}
