import React from "react";

export default function UsageDonut({ usage = {} }) {
  const {
    household_kwh = 0,
    grid_export_kwh = 0,
    battery_storage_kwh = 0,
  } = usage;
  const total = household_kwh + grid_export_kwh + battery_storage_kwh;

  const items = [
    {
      label: "Household Consumption",
      value: household_kwh,
      color: "bg-blue-500",
      text: "text-blue-500",
    },
    {
      label: "Grid Export",
      value: grid_export_kwh,
      color: "bg-emerald-500",
      text: "text-emerald-500",
    },
    {
      label: "Battery Storage",
      value: battery_storage_kwh,
      color: "bg-amber-500",
      text: "text-amber-500",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1">
          Energy Distribution
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Where your generated solar energy goes
        </p>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 mb-4">
        {total === 0 ? (
          <div className="text-slate-400 text-sm">No distribution data</div>
        ) : (
          <div className="w-full space-y-4">
            {/* Simple visual progress bars representing distribution */}
            {items.map((item, idx) => {
              const pct =
                total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-600">
                    <span>{item.label}</span>
                    <span className="font-bold">
                      {item.value} kWh ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 pt-4 mt-auto">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-slate-500">Total Generated</span>
          <span className="font-bold text-slate-800">
            {total.toFixed(1)} kWh
          </span>
        </div>
      </div>
    </div>
  );
}
