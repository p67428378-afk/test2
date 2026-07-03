import React from "react";

export default function EnergyChart({ data = [] }) {
  const maxVal = data.length > 0 ? Math.max(...data.map((d) => d.kwh)) : 100;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Energy Generation History
          </h3>
          <p className="text-xs text-slate-500">
            Daily generation output in kWh
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="h-3 w-3 bg-amber-500 rounded-full"></span>
          <span>Solar Output</span>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
          No historical data available
        </div>
      ) : (
        <div className="flex items-end justify-between h-64 gap-2 pt-4 px-2 border-b border-slate-200">
          {data.map((item, idx) => {
            const heightPct = maxVal > 0 ? (item.kwh / maxVal) * 80 + 10 : 10;
            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center group h-full justify-end"
              >
                <div className="relative w-full flex justify-center">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-10">
                    <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
                      {item.kwh} kWh
                    </span>
                    <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-1"></div>
                  </div>
                  {/* Bar */}
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-[32px] bg-amber-400 hover:bg-amber-500 rounded-t-md transition-all duration-300 cursor-pointer shadow-sm"
                  ></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 font-medium truncate max-w-full">
                  {item.date.split("-").slice(1).join("/")}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
