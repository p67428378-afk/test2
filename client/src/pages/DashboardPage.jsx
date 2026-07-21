import React, { useState, useEffect } from "react";
import {
  scheduleService,
  expeditionService,
  equipmentService,
  fuelService,
  weatherService,
} from "../services/api.js";

export default function DashboardPage() {
  const [schedules, setSchedules] = useState([]);
  const [expeditions, setExpeditions] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [fuelSummary, setFuelSummary] = useState(null);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const [
          schedulesData,
          expeditionsData,
          equipmentData,
          fuelData,
          weatherData,
        ] = await Promise.all([
          scheduleService.getSchedules({ limit: 5 }),
          expeditionService.getExpeditions({ limit: 5 }),
          equipmentService.getEquipment(),
          fuelService.getFuelSummary(),
          weatherService
            .getWeatherAlerts(24.8604, -78.1204)
            .catch(() => ({ alerts: [] })),
        ]);

        setSchedules(schedulesData || []);
        setExpeditions(expeditionsData || []);
        setEquipment(equipmentData || []);
        setFuelSummary(fuelData || null);
        setWeatherAlerts(weatherData?.alerts || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "underway":
        return "78, 222, 163"; // Emerald
      case "planned":
        return "76, 215, 246"; // Cyan
      case "completed":
        return "188, 201, 205"; // Gray
      default:
        return "255, 180, 171"; // Red/Error
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Calculate equipment stats
  const totalEquipment = equipment.length;
  const operationalEquipment = equipment.filter(
    (e) => e.status === "Operational",
  ).length;
  const inRepairEquipment = equipment.filter(
    (e) => e.status === "In Repair" || e.status === "Needs Maintenance",
  ).length;
  const operationalPercentage =
    totalEquipment > 0
      ? Math.round((operationalEquipment / totalEquipment) * 100)
      : 100;

  // Active vessel and expedition
  const activeSchedule =
    schedules.find((s) => s.status === "Underway") || schedules[0];
  const activeExpedition = expeditions[0];

  return (
    <div className="space-y-6">
      {/* 1. Weather Alert Banner */}
      {weatherAlerts.length > 0 ? (
        weatherAlerts.map((alert, idx) => (
          <div
            key={idx}
            className={`w-full rounded-lg p-4 flex items-start gap-4 border shadow-lg ${
              alert.severity === "red"
                ? "bg-error-container/90 text-on-error-container border-error/20"
                : "bg-tertiary-container/90 text-on-tertiary-container border-tertiary/20"
            }`}
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              warning
            </span>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wider">
                {alert.severity} ALERT: {alert.message}
              </h3>
              <p className="text-sm mt-1 opacity-90">Source: {alert.source}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="w-full bg-tertiary-container/90 text-on-tertiary-container rounded-lg p-4 flex items-start gap-4 border border-tertiary/20 shadow-lg">
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
          <div>
            <h3 className="text-lg font-bold">
              AMBER ALERT: Gale warning in Sector 4-North.
            </h3>
            <p className="text-sm mt-1 opacity-90">
              Expected wave heights 4-5m. Vessels in route advised to adjust
              heading.
            </p>
          </div>
        </div>
      )}

      {/* 2. Four Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Active Vessel Status */}
        <div className="glass-panel rounded-lg p-4 card-top-border-primary flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Active Vessel Status
            </span>
            <span className="material-symbols-outlined text-primary text-xl">
              directions_boat
            </span>
          </div>
          <div className="text-2xl font-bold text-on-surface truncate">
            {activeSchedule ? activeSchedule.vessel_name : "No Active Vessel"}
          </div>
          <div className="mt-4 space-y-1 font-mono text-xs text-on-surface-variant/80">
            <div className="flex justify-between">
              <span>Status:</span>
              <span
                className="text-secondary"
                style={{
                  "--status-color": getStatusColor(activeSchedule?.status),
                }}
              >
                {activeSchedule ? activeSchedule.status : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Route:</span>
              <span
                className="truncate max-w-[120px]"
                title={activeSchedule?.route}
              >
                {activeSchedule ? activeSchedule.route : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Port:</span>
              <span>
                {activeSchedule ? activeSchedule.destination_port : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Expedition */}
        <div className="glass-panel rounded-lg p-4 card-top-border-primary flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Active Expedition
            </span>
            <span className="material-symbols-outlined text-primary text-xl">
              explore
            </span>
          </div>
          <div
            className="text-lg font-bold text-on-surface truncate"
            title={activeExpedition?.name || "No Active Expedition"}
          >
            {activeExpedition ? activeExpedition.name : "No Active Expedition"}
          </div>
          <div className="mt-4 space-y-1 font-mono text-xs text-on-surface-variant/80">
            <div className="flex justify-between items-center">
              <span>Goals:</span>
              <span
                className="truncate max-w-[120px]"
                title={activeExpedition?.research_goals}
              >
                {activeExpedition ? activeExpedition.research_goals : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Start:</span>
              <span>
                {activeExpedition
                  ? formatDate(activeExpedition.start_date)
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>End:</span>
              <span>
                {activeExpedition
                  ? formatDate(activeExpedition.end_date)
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Fuel Consumption */}
        <div className="glass-panel rounded-lg p-4 card-top-border-secondary flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Fuel Consumption
            </span>
            <span className="material-symbols-outlined text-secondary text-xl">
              local_gas_station
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-on-surface">
              {fuelSummary
                ? Math.round(fuelSummary.total_fuel_consumed).toLocaleString()
                : "0"}
            </span>
            <span className="font-mono text-xs text-on-surface-variant">L</span>
          </div>
          <div className="mt-4 space-y-1 font-mono text-xs text-on-surface-variant/80">
            <div className="flex justify-between items-center">
              <span>Avg Efficiency:</span>
              <span className="text-secondary flex items-center gap-1">
                {fuelSummary ? Math.round(fuelSummary.average_efficiency) : "0"}{" "}
                L/nm
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Distance:</span>
              <span>
                {fuelSummary
                  ? Math.round(
                      fuelSummary.total_distance_traveled,
                    ).toLocaleString()
                  : "0"}{" "}
                nm
              </span>
            </div>
          </div>
          {/* Minimal Trend Line Placeholder */}
          <div className="h-6 w-full mt-2 bg-gradient-to-r from-secondary/10 to-transparent border-t border-secondary/30 relative">
            <svg
              className="absolute bottom-0 w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 100 20"
            >
              <path
                d="M0 20 Q 25 10, 50 15 T 100 5 L 100 20 L 0 20 Z"
                fill="rgba(78, 222, 163, 0.1)"
              ></path>
              <path
                d="M0 20 Q 25 10, 50 15 T 100 5"
                fill="none"
                stroke="#4edea3"
                strokeWidth="1"
              ></path>
            </svg>
          </div>
        </div>

        {/* Card 4: Equipment Status */}
        <div className="glass-panel rounded-lg p-4 card-top-border-primary flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Equipment Status
            </span>
            <span className="material-symbols-outlined text-primary text-xl">
              precision_manufacturing
            </span>
          </div>
          <div className="text-2xl font-bold text-secondary">
            {operationalPercentage}%{" "}
            <span className="text-xs font-normal text-on-surface-variant">
              Operational
            </span>
          </div>
          <div className="mt-4 space-y-1 font-mono text-xs text-on-surface-variant/80">
            <div className="flex justify-between">
              <span>Total:</span>
              <span>{totalEquipment}</span>
            </div>
            <div className="flex justify-between">
              <span>Operational:</span>
              <span className="text-secondary">{operationalEquipment}</span>
            </div>
            <div className="flex justify-between">
              <span>In Repair:</span>
              <span className="text-tertiary">{inRepairEquipment}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Row 3: Analytics & Map */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[400px]">
        {/* Left (8-col): Fuel & Telemetry Analytics */}
        <div className="xl:col-span-8 glass-panel rounded-lg p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-on-surface">
              Fuel & Telemetry Analytics
            </h2>
            <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary glow-cyan"></span>
                <span className="text-on-surface-variant">
                  Consumption (L/h)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary glow-emerald"></span>
                <span className="text-on-surface-variant">Speed (kts)</span>
              </div>
            </div>
          </div>
          {/* Chart Area (Mocked with CSS grid/svg for layout representation) */}
          <div className="flex-1 relative w-full border-b border-l border-outline-variant/30 pb-6 pl-8">
            {/* Y-Axis Labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-on-surface-variant/50 font-mono text-[10px] pb-6">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>
            {/* Grid Lines */}
            <div className="absolute inset-0 border-t border-outline-variant/10 ml-8 mb-6 mt-1.5 h-[calc(100%-24px)] flex flex-col justify-between pointer-events-none">
              <div className="border-b border-outline-variant/10 w-full flex-1"></div>
              <div className="border-b border-outline-variant/10 w-full flex-1"></div>
              <div className="border-b border-outline-variant/10 w-full flex-1"></div>
              <div className="w-full flex-1"></div>
            </div>
            {/* Mock Data Lines SVG */}
            <svg
              className="absolute inset-0 ml-8 mb-6 w-[calc(100%-32px)] h-[calc(100%-24px)]"
              preserveAspectRatio="none"
            >
              {/* Speed (Secondary) */}
              <path
                d="M0 60 Q 15 40, 30 50 T 60 30 T 90 20"
                fill="none"
                stroke="#4edea3"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              ></path>
              {/* Fuel (Primary) */}
              <path
                d="M0 80 Q 15 70, 30 85 T 60 50 T 90 35"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              ></path>
              {/* Data Points */}
              <circle
                cx="30"
                cy="50"
                fill="#0e1416"
                r="3"
                stroke="#4edea3"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              ></circle>
              <circle
                cx="60"
                cy="30"
                fill="#0e1416"
                r="3"
                stroke="#4edea3"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              ></circle>
              <circle
                cx="30"
                cy="85"
                fill="#0e1416"
                r="3"
                stroke="#06b6d4"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              ></circle>
              <circle
                cx="60"
                cy="50"
                fill="#0e1416"
                r="3"
                stroke="#06b6d4"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              ></circle>
            </svg>
            {/* X-Axis Labels */}
            <div className="absolute bottom-0 left-8 w-[calc(100%-32px)] flex justify-between text-on-surface-variant/50 font-mono text-[10px] pt-2">
              <span>Day 1</span>
              <span>Day 2</span>
              <span>Day 3</span>
              <span>Day 4</span>
              <span>Day 5</span>
              <span>Day 6</span>
              <span>Day 7</span>
            </div>
          </div>
        </div>

        {/* Right (4-col): Active Weather Map & Alerts */}
        <div className="xl:col-span-4 glass-panel rounded-lg p-6 flex flex-col relative overflow-hidden">
          <h2 className="text-lg font-bold text-on-surface mb-4 z-10">
            Weather & Radar
          </h2>
          {/* Map Background */}
          <div
            className="absolute inset-0 z-0 opacity-40 mix-blend-screen"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAhfA2U1sGMCcsY388nNiDUZr-qAzxTOqodeoBiVP9qAwAXLHD-SFgYolLUUTrJaXv-aWDjXN1nRISG6Row5PU9h8WXUguM0N7U5WzCeUbMlDV_H1KTKD8AsEfihidkDeu40vc4O-IDgWzknYiUKa26zSrXpzZZ0zcj-_NE9kB6Jt5YY6zU-f2BL_MktgXk7LbW08aprJJQvKNiza_8i5fll6PHHDHu3bo_3ZIk3J4uWb_v9r8Ioi9U725EcdjzBdtUQrAeu6DveA')",
            }}
          ></div>
          {/* Radar Overlay */}
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border border-primary/20 rounded-full relative animate-[spin_10s_linear_infinite]">
              <div className="absolute top-1/2 left-1/2 w-1/2 h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary origin-left -translate-y-1/2"></div>
              <div className="absolute inset-0 border border-primary/10 rounded-full scale-75"></div>
              <div className="absolute inset-0 border border-primary/10 rounded-full scale-50"></div>
            </div>
          </div>
          {/* Telemetry Overlay */}
          <div className="z-10 mt-auto space-y-3 bg-surface/80 p-3 rounded border border-white/5 backdrop-blur-sm">
            <div className="flex justify-between items-center font-mono text-xs">
              <span className="text-on-surface-variant">Coordinates:</span>
              <span className="text-primary glow-cyan">
                24.8604° N, 78.1204° W
              </span>
            </div>
            <div className="flex justify-between items-center font-mono text-xs">
              <span className="text-on-surface-variant">Wind:</span>
              <span className="text-secondary">22 knots, NE</span>
            </div>
            <div className="flex justify-between items-center font-mono text-xs">
              <span className="text-on-surface-variant">Sea State:</span>
              <span className="text-tertiary">Moderate (Code 4)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Row 4: Schedule Table */}
      <div className="glass-panel rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-on-surface">
            Current Vessel Schedule & Status
          </h2>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="text-on-surface-variant/70 border-b border-white/10">
                <th className="pb-3 pl-2 font-medium">Vessel Name</th>
                <th className="pb-3 font-medium">Route</th>
                <th className="pb-3 font-medium">Start Date</th>
                <th className="pb-3 font-medium">End Date</th>
                <th className="pb-3 font-medium">Dest. Port</th>
                <th className="pb-3 pr-2 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {schedules.map((schedule) => (
                <tr
                  key={schedule.id}
                  className="hover:bg-white/5 transition-colors border-b border-white/5"
                >
                  <td className="py-3 pl-2 text-primary font-bold">
                    {schedule.vessel_name}
                  </td>
                  <td className="py-3 text-on-surface font-sans">
                    {schedule.route}
                  </td>
                  <td className="py-3 text-on-surface-variant">
                    {formatDate(schedule.start_date)}
                  </td>
                  <td className="py-3 text-on-surface-variant">
                    {formatDate(schedule.end_date)}
                  </td>
                  <td className="py-3 text-on-surface-variant">
                    {schedule.destination_port}
                  </td>
                  <td className="py-3 pr-2 text-right">
                    <span
                      className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider status-chip"
                      style={{
                        "--status-color": getStatusColor(schedule.status),
                      }}
                    >
                      {schedule.status}
                    </span>
                  </td>
                </tr>
              ))}
              {schedules.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 text-center text-on-surface-variant italic"
                  >
                    No schedules found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
