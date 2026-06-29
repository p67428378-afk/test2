import React from "react";

export default function AttendanceChart({ data = [0, 0, 0, 0] }) {
  const maxVisits = Math.max(...data, 4); // Fallback to at least 4 for scaling

  return (
    <div className="glass-card rounded-xl p-lg flex flex-col min-h-[320px] w-full">
      <div className="flex justify-between items-center mb-lg border-b border-white/5 pb-sm">
        <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">
          Attendance Frequency
        </h2>
        <select className="bg-surface-container-high border-none text-body-sm text-on-surface rounded-md py-1 px-3 focus:outline-none">
          <option>This Month</option>
        </select>
      </div>
      <div className="flex-1 flex items-end justify-around pt-lg pb-sm relative min-h-[180px]">
        {/* Y-axis guides */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-[24px]">
          <div className="border-b border-white/5 w-full"></div>
          <div className="border-b border-white/5 w-full"></div>
          <div className="border-b border-white/5 w-full"></div>
          <div className="border-b border-white/5 w-full"></div>
        </div>
        {/* Bars */}
        {data.map((visits, index) => {
          const heightPercentage = (visits / maxVisits) * 100;
          return (
            <div
              key={index}
              className="flex flex-col items-center gap-2 z-10 w-16"
            >
              <div className="w-full flex justify-center items-end h-[140px]">
                <div
                  className="w-8 bg-primary rounded-t-sm relative group transition-all hover:bg-primary-fixed flex justify-center"
                  style={{ height: `${Math.max(5, heightPercentage)}%` }}
                >
                  <span className="absolute -top-7 bg-surface-container-highest text-on-surface text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-mono-data">
                    {visits}
                  </span>
                </div>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                W{index + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
