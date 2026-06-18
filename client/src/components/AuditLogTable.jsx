import React from "react";
import { Clock, User, Activity } from "lucide-react";

export default function AuditLogTable({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-6 text-center text-on-surface-variant">
        No audit logs available for this transaction.
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-xl overflow-hidden">
      <div className="p-5 border-b border-outline-variant/20 bg-surface-container/30 flex items-center gap-2">
        <Activity className="w-5 h-5 text-indigo-400" />
        <span className="font-bold text-on-surface">Immutable Audit Log</span>
      </div>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-outline-variant/20 bg-surface-container-lowest/50">
              <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Timestamp
              </th>
              <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Action
              </th>
              <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Actor
              </th>
              <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {logs.map((log) => (
              <tr
                key={log.log_id}
                className="border-b border-outline-variant/10 hover:bg-surface-variant/10 transition-colors"
              >
                <td className="px-5 py-4 font-mono text-on-surface-variant flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      log.action === "CREATE"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : log.action === "UPDATE"
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="px-5 py-4 font-medium text-on-surface flex items-center gap-2">
                  <User className="w-4 h-4 text-on-surface-variant" />
                  {log.actor}
                </td>
                <td className="px-5 py-4 text-on-surface-variant">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
