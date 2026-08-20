import React from "react";
import {
  Box,
  Thermometer,
  Droplets,
  Sprout,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function StatGroup({ stats }) {
  const defaultStats = {
    totalHives: stats?.totalHives ?? 0,
    avgTemp: stats?.avgTemp ?? 35.0,
    avgHumidity: stats?.avgHumidity ?? 62.5,
    totalHarvestKg: stats?.totalHarvestKg ?? 0,
    activeAlerts: stats?.activeAlerts ?? 0,
    scheduledInspections: stats?.scheduledInspections ?? 0,
  };

  const statCards = [
    {
      title: "Active Hives",
      value: defaultStats.totalHives,
      unit: "hives",
      subtitle: "Managed across apiaries",
      icon: Box,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Avg Temperature",
      value: `${defaultStats.avgTemp}°C`,
      unit: "",
      subtitle: "Optimal (33°C - 36°C)",
      icon: Thermometer,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Avg Humidity",
      value: `${defaultStats.avgHumidity}%`,
      unit: "",
      subtitle: "Optimal (50% - 70%)",
      icon: Droplets,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      title: "Total Harvest Yield",
      value: `${defaultStats.totalHarvestKg} kg`,
      unit: "",
      subtitle: "Logged honey production",
      icon: Sprout,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Active Health Alerts",
      value: defaultStats.activeAlerts,
      unit: "alerts",
      subtitle:
        defaultStats.activeAlerts > 0
          ? "Requires attention"
          : "All hives healthy",
      icon: AlertTriangle,
      color: defaultStats.activeAlerts > 0 ? "text-red-600" : "text-green-600",
      bgColor: defaultStats.activeAlerts > 0 ? "bg-red-50" : "bg-green-50",
    },
    {
      title: "Scheduled Inspections",
      value: defaultStats.scheduledInspections,
      unit: "pending",
      subtitle: "Upcoming field visits",
      icon: CheckCircle2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 w-full">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-[#e3e8f0] rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#707a8c]">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg ${card.bgColor} ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-xl font-bold text-[#171c29]">
                {card.value}{" "}
                {card.unit && (
                  <span className="text-xs font-normal text-[#707a8c]">
                    {card.unit}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#707a8c] mt-1">{card.subtitle}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
