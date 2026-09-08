import React, { useState, useEffect } from "react";
import { getActiveOverstays } from "../services/api";
import {
  AlertTriangle,
  Clock,
  RefreshCw,
  Car,
  User,
  ShieldAlert,
} from "lucide-react";

export default function OverstayParkingMonitor() {
  const [overstays, setOverstays] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOverstays = async () => {
    setLoading(true);
    try {
      const data = await getActiveOverstays();
      setOverstays(data || []);
    } catch (err) {
      console.error("Failed to fetch overstay violations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverstays();
    const interval = setInterval(fetchOverstays, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Active Overstay & Parking Violation Monitor
          </h2>
        </div>

        <button
          onClick={fetchOverstays}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 text-xs font-semibold py-1 px-2 rounded border border-slate-300"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />{" "}
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <th className="py-2.5 px-3">Visitor Name</th>
              <th className="py-2.5 px-3">Vehicle / Slot</th>
              <th className="py-2.5 px-3">Entry Time</th>
              <th className="py-2.5 px-3">Expected Exit</th>
              <th className="py-2.5 px-3">Grace Period Expiry (+30m)</th>
              <th className="py-2.5 px-3 text-right">Violation Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {overstays.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-slate-400">
                  ✓ No active overstay or parking violations detected.
                </td>
              </tr>
            ) : (
              overstays.map((item, idx) => (
                <tr
                  key={item.visitor_id || idx}
                  className="bg-red-50/40 hover:bg-red-50 transition"
                >
                  <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    {item.visitor_name}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-800">
                    <div className="flex items-center gap-1">
                      <Car className="w-3.5 h-3.5 text-blue-600" />
                      <span>{item.vehicle_number || "N/A"}</span>
                      {item.slot_number && (
                        <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                          {item.slot_number}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {item.entry_time
                      ? new Date(item.entry_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {item.expected_exit_time
                      ? new Date(item.expected_exit_time).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" },
                        )
                      : "N/A"}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                    {item.grace_period_expires
                      ? new Date(item.grace_period_expires).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" },
                        )
                      : "N/A"}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="bg-red-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full animate-pulse flex items-center gap-1 justify-end ml-auto w-fit shadow">
                      <AlertTriangle className="w-3 h-3" /> OVERSTAY DETECTED
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
