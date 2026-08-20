import React from "react";

export default function StatCard({ title, value, badgeText, badgeColor }) {
  return (
    <div className="bg-white border border-[#e3e8f0] flex flex-1 flex-col gap-1 items-start p-4 rounded-2xl shadow-sm min-w-[200px]">
      <p className="font-medium text-[#707a8c] text-xs whitespace-nowrap">
        {title}
      </p>
      <div className="flex gap-2 items-center">
        <p className="font-bold text-[#171c29] text-2xl whitespace-nowrap">
          {value}
        </p>
        {badgeText && (
          <div
            className={`${badgeColor || "bg-[#2663eb]"} flex items-center justify-center px-2 py-1 rounded-full shrink-0`}
          >
            <p className="font-medium text-[10px] text-white whitespace-nowrap">
              {badgeText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
