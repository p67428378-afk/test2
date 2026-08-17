import React from "react";
import { Shield, Clock, FileText } from "lucide-react";

export default function AuditLogsTable({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500">
        <FileText className="h-10 w-10 mx-auto mb-2 text-slate-400" />
        <p className="font-medium text-slate-700">No audit logs recorded</p>
        <p className="text-sm">
          Freshness transitions and system events will log here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
        <Shield className="h-5 w-5 text-emerald-600" />
        <span>System Operations Audit Logs</span>
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-semibold text-xs uppercase border-b border-slate-200">
            <tr>
              <th className="p-3">Log ID</th>
              <th className="p-3">Donation ID</th>
              <th className="p-3">Status Transition</th>
              <th className="p-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition">
                <td className="p-3 font-mono text-xs text-slate-500">
                  {log.id.slice(0, 8)}
                </td>
                <td className="p-3 font-mono text-xs text-slate-500">
                  {log.donation_id.slice(0, 8)}
                </td>
                <td className="p-3">
                  <span className="font-semibold text-slate-700">
                    {log.old_status}
                  </span>
                  <span className="mx-2 text-slate-400">&rarr;</span>
                  <span
                    className={`font-semibold ${
                      log.new_status === "EXPIRED"
                        ? "text-rose-600"
                        : log.new_status === "WARNING"
                          ? "text-amber-600"
                          : "text-emerald-600"
                    }`}
                  >
                    {log.new_status}
                  </span>
                </td>
                <td className="p-3 text-xs text-slate-400">
                  {new Date(log.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
