import React from "react";
import { X, Bell, AlertTriangle, CheckCircle, Info } from "lucide-react";

export default function NotificationsDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      type: "success",
      title: "In-Stock Guardrail Satisfied",
      message: "Small Town Value Cluster in-stock rate verified at 96.2%.",
      time: "10m ago",
    },
    {
      id: 2,
      type: "warning",
      title: "PB Share Target Alert",
      message:
        "Snacks category Private Brand Share is close to 25.0% minimum threshold.",
      time: "1h ago",
    },
    {
      id: 3,
      type: "info",
      title: "Quarterly Optimization Ready",
      message: "New SKU recommendations generated for Q3 Snacks assortment.",
      time: "3h ago",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-sm bg-slate-800 border-l border-slate-700 h-full p-6 flex flex-col shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-700 pb-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Bell className="h-5 w-5" />
            <h3 className="font-bold text-lg text-slate-100">Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-900 border border-slate-700 rounded-lg space-y-1 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                  {item.type === "success" && (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  )}
                  {item.type === "warning" && (
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                  )}
                  {item.type === "info" && (
                    <Info className="h-4 w-4 text-blue-400" />
                  )}
                  {item.title}
                </span>
                <span className="text-[10px] text-slate-400">{item.time}</span>
              </div>
              <p className="text-xs text-slate-400">{item.message}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Mark All as Read
          </button>
        </div>
      </div>
    </div>
  );
}
