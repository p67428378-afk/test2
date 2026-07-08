import React, { useState } from "react";

export default function GrowthChart() {
  const [timeframe, setTimeframe] = useState("Last 30 Days");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
      {/* Area Chart Placeholder (8 col) */}
      <div className="lg:col-span-8 bg-surface-container-low border border-outline-variant rounded-xl p-5 flex flex-col h-[320px]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline-md text-headline-md text-on-surface text-lg">
            Round-Up Investment Growth
          </h2>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-surface-container border border-outline-variant text-on-surface-variant text-sm rounded px-2 py-1 focus:outline-none focus:border-primary"
          >
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>All Time</option>
          </select>
        </div>
        <div className="flex-1 w-full bg-surface-container-lowest border border-outline-variant/50 rounded-lg relative overflow-hidden flex items-end justify-center pb-8">
          <p className="text-on-surface-variant text-sm opacity-50 z-10 absolute bottom-4">
            Chart Visualization Area ({timeframe} cumulative growth)
          </p>
          {/* Simulated Area Chart Gradient */}
          <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-primary/30 to-transparent border-t-2 border-primary clip-path-chart"></div>
        </div>
      </div>

      {/* Donut Chart Placeholder (4 col) */}
      <div className="lg:col-span-4 bg-surface-container-low border border-outline-variant rounded-xl p-5 flex flex-col h-[320px]">
        <h2 class="font-headline-md text-headline-md text-on-surface text-lg mb-6">
          Asset Allocation
        </h2>
        <div className="flex-1 flex flex-col items-center justify-center relative">
          {/* Simulated Donut */}
          <div className="w-40 h-40 rounded-full border-[16px] border-surface-container-highest relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[16px] border-primary clip-path-donut-1 opacity-80"></div>
            <div className="absolute inset-0 rounded-full border-[16px] border-secondary clip-path-donut-2 opacity-80"></div>
            <div className="text-center">
              <span className="block font-label-sm text-label-sm text-on-surface-variant">
                Total Assets
              </span>
              <span className="block font-headline-md text-headline-md text-on-surface text-lg">
                3
              </span>
            </div>
          </div>
          {/* Legend */}
          <div className="w-full mt-6 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="w-3 h-3 rounded bg-primary opacity-80"></span>{" "}
                Tech ETF
              </div>
              <span className="font-mono-data text-mono-data text-on-surface">
                40%
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="w-3 h-3 rounded bg-secondary opacity-80"></span>{" "}
                Green Energy
              </div>
              <span className="font-mono-data text-mono-data text-on-surface">
                30%
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="w-3 h-3 rounded bg-surface-container-highest"></span>{" "}
                S&P 500
              </div>
              <span className="font-mono-data text-mono-data text-on-surface">
                30%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
