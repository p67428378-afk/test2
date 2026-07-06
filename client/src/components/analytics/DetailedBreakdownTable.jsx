import React from "react";

export default function DetailedBreakdownTable({ dataPoints }) {
  if (!dataPoints || dataPoints.length === 0) {
    return (
      <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-6 text-center text-slate-400">
        No historical data available for the selected filters.
      </div>
    );
  }

  return (
    <div className="bg-[#1E293B] border border-slate-800 rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-800">
        <h3 className="text-base font-semibold text-[#F8FAFC]">
          Detailed Daily Breakdown
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
              <th className="px-6 py-3.5">Timestamp</th>
              <th className="px-6 py-3.5 text-right">Generation (kWh)</th>
              <th className="px-6 py-3.5 text-right">Consumption (kWh)</th>
              <th className="px-6 py-3.5 text-right">Estimated Cost (USD)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm text-slate-300 font-mono">
            {dataPoints.map((point, idx) => {
              const formattedDate = new Date(point.timestamp).toLocaleString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              );

              return (
                <tr
                  key={idx}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 text-slate-400 font-sans">
                    {formattedDate}
                  </td>
                  <td className="px-6 py-4 text-right text-[#10B981]">
                    {point.generation_kwh
                      ? point.generation_kwh.toFixed(2)
                      : "0.00"}
                  </td>
                  <td className="px-6 py-4 text-right text-sky-400">
                    {point.consumption_kwh
                      ? point.consumption_kwh.toFixed(2)
                      : "0.00"}
                  </td>
                  <td className="px-6 py-4 text-right text-amber-500">
                    ${point.cost_usd ? point.cost_usd.toFixed(2) : "0.00"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
