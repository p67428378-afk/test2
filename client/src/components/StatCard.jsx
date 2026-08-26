import React from "react";

export default function StatCard({
  title,
  count,
  badgeText,
  badgeColor = "bg-[#eb9917]",
  icon: Icon,
}) {
  return (
    <div className="bg-white border border-[#e3e8f0] flex flex-1 flex-col gap-1 p-5 rounded-2xl shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between text-[#707a8c]">
        <p className="text-xs font-semibold uppercase tracking-wider">
          {title}
        </p>
        {Icon && <Icon className="w-4 h-4 text-[#707a8c]" />}
      </div>
      <div className="flex gap-3 items-baseline mt-2">
        <p className="text-[#171c29] text-3xl font-extrabold">
          {typeof count === "number" ? count : 0}
        </p>
        {badgeText && (
          <span
            className={`${badgeColor} px-2.5 py-0.5 rounded-full text-xs font-medium text-white`}
          >
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
