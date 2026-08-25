import React from "react";
import { History, User, Activity } from "lucide-react";

export default function AuditTrailTable({ logs, isLoading, fineIdFilter }) {
  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    try {
      return new Date(isoString).toLocaleString();
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">
            Administrative Audit Trail Logs
          </h3>
        </div>
        {fineIdFilter && (
          <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-mono border border-blue-200">
            Filtered fine ID: {fineIdFilter.substring(0, 8)}...
          </span>
        )}
      </div>

      <div className="overflow-x-auto max-h-80">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-100 font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200 sticky top-0">
            <tr>
              <th className="px-4 py-2.5">Timestamp</th>
              <th className="px-4 py-2.5">Admin Actor</th>
              <th className="px-4 py-2.5">Action</th>
              <th className="px-4 py-2.5">Fine ID</th>
              <th className="px-4 py-2.5">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-slate-400">
                  Loading audit logs...
                </td>
              </tr>
            ) : !logs || logs.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-slate-400">
                  No audit log records available.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-2.5 whitespace-nowrap text-slate-500 font-mono">
                    {formatDate(log.created_at)}
                  </td>
                  <td className="px-4 py-2.5 font-medium text-slate-900 flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{log.actor_id}</span>
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-blue-700">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded text-blue-800">
                      <Activity className="w-3 h-3 text-blue-600" />
                      <span>{log.action}</span>
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">
                    {log.fine_id
                      ? log.fine_id.substring(0, 8) + "..."
                      : "System"}
                  </td>
                  <td className="px-4 py-2.5 text-slate-700">
                    {log.notes || "—"}
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
