import React from "react";
import { Sun, Wind, Battery, Radio } from "lucide-react";

export default function KPIGrid({ data }) {
  const solar = data?.solar || {
    power_output_kw: 0,
    daily_energy_kwh: 0,
    illumination_lux: 0,
  };
  const wind = data?.wind || {
    power_output_kw: 0,
    turbine_rpm: 0,
    wind_speed_ms: 0,
  };
  const battery = data?.battery || {
    charge_level_pct: 0,
    status: "Idle",
    remaining_time_mins: 0,
  };
  const grid = data?.grid || { power_draw_kw: 0, status: "Disconnected" };

  const cards = [
    {
      title: "Solar Array",
      icon: Sun,
      iconColor: "text-amber-500",
      metrics: [
        {
          label: "Power Output",
          value: `${solar.power_output_kw.toFixed(1)} kW`,
        },
        {
          label: "Daily Energy",
          value: `${solar.daily_energy_kwh.toFixed(1)} kWh`,
        },
        {
          label: "Illumination",
          value: `${solar.illumination_lux.toLocaleString()} lux`,
        },
      ],
    },
    {
      title: "Wind Turbine",
      icon: Wind,
      iconColor: "text-sky-400",
      metrics: [
        {
          label: "Power Output",
          value: `${wind.power_output_kw.toFixed(1)} kW`,
        },
        { label: "Turbine RPM", value: `${wind.turbine_rpm} RPM` },
        { label: "Wind Speed", value: `${wind.wind_speed_ms.toFixed(1)} m/s` },
      ],
    },
    {
      title: "Battery Storage",
      icon: Battery,
      iconColor: "text-emerald-500",
      metrics: [
        { label: "Charge Level", value: `${battery.charge_level_pct}%` },
        { label: "Status", value: battery.status },
        {
          label: "Remaining Time",
          value: `${battery.remaining_time_mins} mins`,
        },
      ],
    },
    {
      title: "Grid Connection",
      icon: Radio,
      iconColor: "text-indigo-400",
      metrics: [
        { label: "Power Draw", value: `${grid.power_draw_kw.toFixed(1)} kW` },
        { label: "Status", value: grid.status },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-[#1E293B] border border-slate-800 rounded-xl p-6 shadow-lg hover:border-slate-700 transition-all"
          >
            <div className="flex items-center justify-between gap-4 mb-4 min-w-0">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider truncate">
                {card.title}
              </h3>
              <Icon className={`h-6 w-6 flex-shrink-0 ${card.iconColor}`} />
            </div>
            <div className="space-y-3">
              {card.metrics.map((metric, mIdx) => (
                <div
                  key={mIdx}
                  className="flex justify-between items-center border-b border-slate-800/50 pb-1.5 last:border-0 last:pb-0"
                >
                  <span className="text-xs text-slate-400">{metric.label}</span>
                  <span className="text-sm font-semibold text-[#F8FAFC] font-mono">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
