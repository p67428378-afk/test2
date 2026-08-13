import React from "react";
import {
  X,
  AlertTriangle,
  Send,
  Bell,
  Shield,
  CheckCircle2,
} from "lucide-react";

export const StandbyDispatchDrawer = ({ alerts, onClose }) => {
  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-800 border-l border-slate-700 shadow-2xl flex flex-col">
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-700/80 bg-slate-800/90 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">
            Standby Broadcast & Alerts
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-xs text-amber-300">
          <p className="font-semibold mb-1">Automated Replacement Protocol</p>
          <p className="text-amber-200/80">
            Shift drops within 1 hour trigger automated broadcast push alerts to
            off-duty standby volunteers in the same operational zone.
          </p>
        </div>

        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Active Standby Alerts ({alerts.length})
        </h3>

        {alerts.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p>
              No active replacement alerts. All operational zones fully covered.
            </p>
          </div>
        ) : (
          alerts.map((alert, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-700/80 p-4 rounded-2xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {alert.alert_type || "SHIFT_DROP_STANDBY"}
                </span>
                <span className="text-[11px] text-slate-400">
                  {alert.timestamp
                    ? new Date(alert.timestamp).toLocaleTimeString()
                    : "Just now"}
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Zone:{" "}
                  <span className="text-indigo-300">
                    {alert.zone_name || alert.zone || "Gate 1"}
                  </span>
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  {alert.message ||
                    alert.details ||
                    "Volunteer dropped shift within 1 hour. Standby notification sent."}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Standby Broadcast:{" "}
                  <strong className="text-emerald-400">Dispatched</strong>
                </span>
                <button
                  onClick={() =>
                    alert("Manual dispatch ping re-sent to standby crew.")
                  }
                  className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 rounded-lg font-medium transition flex items-center space-x-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Re-Ping</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-slate-700/80 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center space-x-1">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Zone Coverage Active</span>
        </span>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold transition"
        >
          Close Panel
        </button>
      </div>
    </div>
  );
};
