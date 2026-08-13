import React from "react";
import { AlertTriangle, Users, MapPin } from "lucide-react";

export default function StageOccupancyHeatmap({ stages = [] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" /> Stage Occupancy &
            Heatmap
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time stage crowd density monitoring with automatic threshold
            alerts (&ge;85% capacity)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stages.map((stage) => {
          const ratio =
            stage.occupancy_ratio ||
            stage.current_occupancy / (stage.max_capacity || 1);
          const pct = Math.min(100, Math.round(ratio * 100));

          let statusBg =
            "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
          let progressBg = "bg-emerald-500";
          let statusText = "NORMAL";

          if (pct >= 95 || stage.alert_status === "CRITICAL") {
            statusBg =
              "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse";
            progressBg = "bg-rose-500";
            statusText = "CRITICAL OVERCROWD";
          } else if (
            pct >= 85 ||
            stage.alert_status === "THRESHOLD_EXCEEDED_85"
          ) {
            statusBg = "bg-amber-500/20 text-amber-400 border-amber-500/40";
            progressBg = "bg-amber-500";
            statusText = "ALERT ≥85% CAPACITY";
          }

          return (
            <div
              key={stage.stage_id || stage.id || stage.stage_name}
              className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 hover:border-slate-600 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    {stage.stage_name || stage.name}
                  </h3>
                  <div className="flex items-center space-x-1 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Zone: {stage.location_zone || "Festival Field"}</span>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold flex items-center gap-1 ${statusBg}`}
                >
                  {pct >= 85 && <AlertTriangle className="w-3 h-3 shrink-0" />}
                  {statusText}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-slate-400">Occupancy Ratio</span>
                  <span className="text-slate-200 font-mono font-bold">
                    {stage.current_occupancy?.toLocaleString()} /{" "}
                    {stage.max_capacity?.toLocaleString()}{" "}
                    <span className="text-indigo-400">({pct}%)</span>
                  </span>
                </div>

                <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${progressBg}`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}

        {stages.length === 0 && (
          <div className="col-span-2 text-center py-8 text-slate-500 text-sm">
            No stage telemetry data available.
          </div>
        )}
      </div>
    </div>
  );
}
