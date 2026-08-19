import React, { useState } from "react";

export default function CategoryBreakdown({
  costByType = {},
  costByLocation = {},
}) {
  const [activeTab, setActiveTab] = useState("type");

  const activeData = activeTab === "type" ? costByType : costByLocation;
  const entries = Object.entries(activeData || {});
  const totalSum = entries.reduce((acc, [_, val]) => acc + val, 0);

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-[#e3e8f0] pb-3">
        <h3 className="text-base font-bold text-[#171c29]">
          Cost Distribution
        </h3>
        <div className="flex bg-[#f7fafc] p-1 rounded-lg border border-[#e3e8f0]">
          <button
            type="button"
            onClick={() => setActiveTab("type")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === "type"
                ? "bg-white text-[#2663eb] shadow-sm font-semibold"
                : "text-[#707a8c] hover:text-[#171c29]"
            }`}
          >
            By Type
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("location")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === "location"
                ? "bg-white text-[#2663eb] shadow-sm font-semibold"
                : "text-[#707a8c] hover:text-[#171c29]"
            }`}
          >
            By Location
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#707a8c]">
          No expense breakdown available for this selection.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map(([label, cost]) => {
            const percentage =
              totalSum > 0 ? Math.round((cost / totalSum) * 100) : 0;
            return (
              <div key={label} className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-[#171c29] truncate max-w-[200px]">
                    {label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#707a8c]">${cost.toFixed(2)}</span>
                    <span className="text-xs font-bold text-[#2663eb] min-w-[36px] text-right">
                      {percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-[#f7fafc] h-2 rounded-full overflow-hidden border border-[#e3e8f0]">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="bg-[#2663eb] h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
