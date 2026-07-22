import React from "react";

export default function SensorGrid({ hive }) {
  const latestTemp = hive.sensor_history_24h?.[0]?.temperature ?? "N/A";
  const latestHum = hive.sensor_history_24h?.[0]?.humidity ?? "N/A";
  const latestPop = hive.population_logs?.[0]?.estimated_population ?? "N/A";
  const latestProd = hive.production_logs?.[0]?.quantity_kg ?? "N/A";

  const stats = [
    {
      label: "Temperature",
      value: latestTemp !== "N/A" ? `${latestTemp}°C` : "N/A",
      icon: "thermostat",
      color: "text-primary",
    },
    {
      label: "Humidity",
      value: latestHum !== "N/A" ? `${latestHum}%` : "N/A",
      icon: "humidity_percentage",
      color: "text-secondary",
    },
    {
      label: "Honey Capacity",
      value: `${hive.honey_capacity_pct}%`,
      icon: "water_drop",
      color: "text-primary-container",
    },
    {
      label: "Est. Population",
      value: latestPop !== "N/A" ? `${(latestPop / 1000).toFixed(0)}k` : "N/A",
      icon: "hive",
      color: "text-tertiary-container",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md mb-xl">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-surface-container p-lg rounded-lg border border-outline-variant hover:border-outline transition-colors group"
        >
          <div className="flex justify-between items-start mb-md">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              {stat.label}
            </span>
            <span
              className={`material-symbols-outlined ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`}
            >
              {stat.icon}
            </span>
          </div>
          <div className="flex items-baseline gap-sm">
            <span className="font-headline-lg text-headline-lg text-on-surface">
              {stat.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
