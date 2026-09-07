import React, { useState, useEffect } from "react";
import { AlertCircle, Timer, ShieldX, CheckCircle, Radio } from "lucide-react";
import { cancelSecurityAlert } from "../services/api";

export default function FalseAlarmCancelBanner({ alerts = [], onRefresh }) {
  const [cancellationReasons, setCancellationReasons] = useState({});
  const [cancellingId, setCollectingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [now, setNow] = useState(Date.now());

  // Update live timer every second
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleReasonChange = (alertId, text) => {
    setCancellationReasons({ ...cancellationReasons, [alertId]: text });
  };

  const handleCancelAlert = async (alertId) => {
    const reason =
      cancellationReasons[alertId] ||
      "Accidental false trigger cancelled by supervisor";
    setCollectingId(alertId);
    setErrorMsg(null);

    try {
      await cancelSecurityAlert(alertId, reason);
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error("Failed to cancel security alert:", err);
      const detail =
        err.response?.data?.detail || err.message || "Cancellation failed";
      setErrorMsg(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setCollectingId(null);
    }
  };

  const activeAlerts = alerts.filter((a) => a.status === "ACTIVE");

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Active Security Alerts & Supervisor Control
          </h2>
        </div>
        <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-red-200">
          {activeAlerts.length} Active
        </span>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg"
        >
          {errorMsg}
        </div>
      )}

      {activeAlerts.length === 0 ? (
        <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
          <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-600">
            No active security alerts. All gates clear.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeAlerts.map((alert) => {
            const createdTime = alert.created_at
              ? new Date(alert.created_at).getTime()
              : now;
            const elapsedSec = Math.floor((now - createdTime) / 1000);
            const remainingSec = Math.max(0, 60 - elapsedSec);
            const canCancel = remainingSec > 0;

            return (
              <div
                key={alert.alert_id || alert.id}
                className="bg-red-50/60 border border-red-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded uppercase tracking-wide">
                      {alert.severity}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {alert.alert_type}
                    </h4>
                    <span className="text-xs text-slate-600 font-medium">
                      @ {alert.location}
                    </span>
                  </div>

                  {/* 60s Countdown Timer Badge */}
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                      canCancel
                        ? "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <Timer className="w-4 h-4" />
                    <span>
                      {canCancel
                        ? `Cancel window: ${remainingSec}s`
                        : "Window Expired (>60s)"}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 mb-3">
                  {alert.description}
                </p>

                {canCancel ? (
                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-red-100">
                    <input
                      type="text"
                      placeholder="Reason for false alarm cancellation..."
                      value={
                        cancellationReasons[alert.alert_id || alert.id] || ""
                      }
                      onChange={(e) =>
                        handleReasonChange(
                          alert.alert_id || alert.id,
                          e.target.value,
                        )
                      }
                      className="w-full sm:flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                    <button
                      onClick={() =>
                        handleCancelAlert(alert.alert_id || alert.id)
                      }
                      disabled={cancellingId === (alert.alert_id || alert.id)}
                      className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-medium py-1.5 px-4 rounded-lg text-xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <ShieldX className="w-4 h-4 text-red-400" />
                      {cancellingId === (alert.alert_id || alert.id)
                        ? "Cancelling..."
                        : "Cancel False Alarm (Supervisor)"}
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 italic pt-1 border-t border-red-100">
                    Active incident logged. 60-second false alarm supervisor
                    cancellation window has passed.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
