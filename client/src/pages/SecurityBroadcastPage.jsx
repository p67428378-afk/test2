import React, { useState, useEffect } from "react";
import SecurityAlertTrigger from "../components/SecurityAlertTrigger";
import FalseAlarmCancelBanner from "../components/FalseAlarmCancelBanner";
import { getSecurityAlerts } from "../services/api";
import { RefreshCw, Radio, ShieldAlert } from "lucide-react";

export default function SecurityBroadcastPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const data = await getSecurityAlerts();
      setAlerts(data);
    } catch (err) {
      console.error("Failed to fetch security alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Poll for emergency alerts every 5s
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAlertCreated = () => {
    fetchAlerts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Security Emergency Broadcast Center
          </h1>
          <p className="text-sm text-slate-600">
            Real-time security alert broadcasting, active guard terminal feeds,
            and 60s false alarm cancellation.
          </p>
        </div>

        <button
          onClick={fetchAlerts}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 px-3 rounded-lg border border-slate-300 transition"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
          />{" "}
          Refresh Feed
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecurityAlertTrigger onAlertCreated={handleAlertCreated} />
        <FalseAlarmCancelBanner alerts={alerts} onRefresh={fetchAlerts} />
      </div>

      {/* Security Incident History Audit Log */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <ShieldAlert className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Incident & Broadcast Audit History
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Incident Type</th>
                <th className="py-2.5 px-3">Location Tag</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Created At</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-400">
                    No security incident alerts recorded.
                  </td>
                </tr>
              ) : (
                alerts.map((a) => (
                  <tr
                    key={a.alert_id || a.id}
                    className="hover:bg-slate-50 transition"
                  >
                    <td className="py-3 px-3">
                      <span
                        className={`font-black px-2 py-0.5 rounded text-[10px] ${
                          a.severity === "CRITICAL"
                            ? "bg-red-800 text-white"
                            : a.severity === "HIGH"
                              ? "bg-red-100 text-red-800"
                              : a.severity === "MEDIUM"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {a.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {a.alert_type}
                    </td>
                    <td className="py-3 px-3 text-slate-800 font-medium">
                      {a.location}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {a.description}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {a.created_at
                        ? new Date(a.created_at).toLocaleString()
                        : "N/A"}
                    </td>
                    <td className="py-3 px-3">
                      {a.status === "ACTIVE" ? (
                        <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full border border-red-300">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="bg-slate-200 text-slate-700 font-medium px-2 py-0.5 rounded-full">
                          CANCELLED ({a.cancelled_by || "Supervisor"})
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
