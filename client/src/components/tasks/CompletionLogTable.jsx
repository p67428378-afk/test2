import React from "react";
import {
  Calendar,
  DollarSign,
  User,
  FileText,
  CheckCircle,
} from "lucide-react";

export default function CompletionLogTable({ logs = [], users = [] }) {
  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.full_name || user.email : userId || "Unknown";
  };

  if (!logs || logs.length === 0) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-8 text-center text-[#707a8c] shadow-sm">
        <CheckCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm font-medium">No completion logs recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-[#e3e8f0] bg-[#f7fafc]">
        <h3 className="text-sm font-bold text-[#171c29]">Completion History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#f7fafc] border-b border-[#e3e8f0] text-xs font-semibold text-[#707a8c] uppercase">
              <th className="py-3 px-4">Completed At</th>
              <th className="py-3 px-4">Actual Cost</th>
              <th className="py-3 px-4">Completed By</th>
              <th className="py-3 px-4">Receipt Ref</th>
              <th className="py-3 px-4">Notes</th>
              <th className="py-3 px-4">Next Instance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e3e8f0]">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-[#f2f5fa]">
                <td className="py-3 px-4 text-xs font-medium text-[#171c29]">
                  {log.completed_at
                    ? new Date(log.completed_at).toLocaleString()
                    : "N/A"}
                </td>
                <td className="py-3 px-4 font-semibold text-[#17a34a]">
                  ${Number(log.actual_cost || 0).toFixed(2)}
                </td>
                <td className="py-3 px-4 text-xs text-[#707a8c]">
                  {getUserName(log.completed_by)}
                </td>
                <td className="py-3 px-4 text-xs text-[#707a8c]">
                  {log.receipt_reference || "-"}
                </td>
                <td className="py-3 px-4 text-xs text-[#707a8c] max-w-xs truncate">
                  {log.notes || "-"}
                </td>
                <td className="py-3 px-4 text-xs font-mono text-[#2663eb]">
                  {log.next_task_id ? (
                    <span className="bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                      Auto-scheduled
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
