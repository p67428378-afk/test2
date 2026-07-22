import React from "react";
import { Link } from "react-router-dom";
import ProgressBar from "../common/ProgressBar";

export default function HiveCard({ hive }) {
  const isAlert =
    hive.status === "alert" ||
    hive.status === "danger" ||
    hive.status === "unhealthy";
  const statusColor = isAlert ? "bg-error" : "bg-tertiary-container";

  const latestTemp = hive.latest_sensor_data?.temperature ?? "N/A";
  const latestHum = hive.latest_sensor_data?.humidity ?? "N/A";

  return (
    <div
      className={`bg-surface p-md rounded-lg border ${isAlert ? "border-error/50 bg-error/5" : "border-outline-variant"} flex flex-col gap-md`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4
            className={`font-body-lg text-body-lg font-bold ${isAlert ? "text-error" : "text-on-surface"}`}
          >
            {hive.name}
          </h4>
          <span className="font-label-md text-label-md text-on-surface-variant">
            {hive.location}
          </span>
        </div>
        <span
          className={`w-2.5 h-2.5 rounded-full ${statusColor} mt-1 ${isAlert ? "animate-pulse shadow-[0_0_8px_rgba(255,180,171,0.6)]" : ""}`}
        ></span>
      </div>
      <div
        className={`grid grid-cols-2 gap-sm font-mono-data text-mono-data ${isAlert ? "text-error" : "text-on-surface-variant"}`}
      >
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-outline">
            Temp
          </span>
          {latestTemp !== "N/A" ? `${latestTemp}°C` : "N/A"}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-outline">
            Hum
          </span>
          {latestHum !== "N/A" ? `${latestHum}%` : "N/A"}
        </div>
      </div>
      <div className="mt-auto pt-sm border-t border-outline-variant flex justify-between items-center">
        <div className="w-full mr-sm">
          <div className="flex justify-between text-[10px] text-outline mb-1">
            <span>Honey Capacity</span>
            <span>{hive.honey_capacity_pct}%</span>
          </div>
          <ProgressBar
            value={hive.honey_capacity_pct}
            color={isAlert ? "error" : "primary"}
          />
        </div>
        <Link
          to={`/hives/${hive.id}`}
          className="font-label-md text-[10px] text-primary whitespace-nowrap cursor-pointer hover:underline"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
