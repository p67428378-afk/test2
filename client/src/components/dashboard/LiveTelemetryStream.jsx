import React, { useEffect, useState } from "react";
import { Radio, Activity } from "lucide-react";
import { getTelemetryStreamUrl } from "../../services/api";

export default function LiveTelemetryStream() {
  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let eventSource;
    try {
      const streamUrl = getTelemetryStreamUrl();
      eventSource = new EventSource(streamUrl);

      eventSource.onopen = () => setIsConnected(true);

      eventSource.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          setLogs((prev) => [
            {
              id: Math.random().toString(36).substr(2, 9),
              stage_name: parsed.stage_name,
              occupancy: parsed.current_occupancy,
              max_capacity: parsed.max_capacity,
              ratio: parsed.occupancy_ratio,
              alert_status: parsed.alert_status,
              timestamp: parsed.timestamp || new Date().toLocaleTimeString(),
            },
            ...prev.slice(0, 19),
          ]);
        } catch (err) {
          console.error("Failed to parse SSE payload", err);
        }
      };

      eventSource.onerror = () => {
        setIsConnected(false);
        eventSource.close();
      };
    } catch (err) {
      setIsConnected(false);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" /> Live Telemetry
          Stream
        </h2>
        <div className="flex items-center space-x-2 text-xs">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isConnected ? "bg-emerald-500 animate-ping" : "bg-amber-500"
            }`}
          ></span>
          <span className="text-slate-400">
            {isConnected ? "SSE Active" : "Polling Sync"}
          </span>
        </div>
      </div>

      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-y-auto max-h-[300px] space-y-2">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-center justify-between border-b border-slate-800/80 pb-1.5 pt-0.5 text-slate-300"
          >
            <div className="flex items-center space-x-2">
              <span className="text-slate-500 text-[10px]">
                {log.timestamp?.substring(11, 19) || log.timestamp}
              </span>
              <span className="font-semibold text-indigo-400">
                {log.stage_name}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span>
                Occ: <strong className="text-white">{log.occupancy}</strong> (
                {Math.round(log.ratio * 100)}%)
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-sans uppercase ${
                  log.alert_status === "THRESHOLD_EXCEEDED_85"
                    ? "bg-amber-500/20 text-amber-300 font-bold"
                    : "bg-emerald-500/10 text-emerald-400"
                }`}
              >
                {log.alert_status === "THRESHOLD_EXCEEDED_85"
                  ? "≥85% Alert"
                  : "OK"}
              </span>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <div className="text-center py-10 text-slate-600 flex flex-col items-center">
            <Radio className="w-8 h-8 text-slate-700 animate-pulse mb-2" />
            <span>Listening for real-time telemetry events...</span>
          </div>
        )}
      </div>
    </div>
  );
}
