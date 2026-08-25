import React from "react";
import {
  History,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
} from "lucide-react";

export default function AuditLogTable({ adjustments = [] }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl shadow-sm w-full overflow-hidden">
      <div className="px-6 py-4 border-b border-[#e3e8f0] flex items-center gap-2">
        <History className="h-5 w-5 text-blue-500" />
        <h3 className="font-bold text-lg text-[#0f172a]">
          Stock Adjustments Audit Log
        </h3>
      </div>

      <div className="overflow-x-auto">
        {adjustments.length === 0 ? (
          <div className="p-8 text-center text-[#707a8c]">
            No stock adjustments recorded yet.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-[#707a8c] uppercase border-b border-[#e3e8f0]">
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Item Name</th>
                <th className="px-6 py-3">Warehouse</th>
                <th className="px-6 py-3 text-right">Change</th>
                <th className="px-6 py-3">Reason</th>
                <th className="px-6 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e8f0] text-sm">
              {adjustments.map((adj) => {
                const isAddition = adj.change > 0;
                const isTransfer =
                  adj.reason === "TRANSFER_IN" || adj.reason === "TRANSFER_OUT";

                return (
                  <tr key={adj.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {formatDate(adj.timestamp)}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">
                      {adj.user}
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-900 whitespace-nowrap">
                      {adj.sku}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{adj.item_name}</td>
                    <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                      {adj.warehouse}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 font-bold">
                        {isTransfer ? (
                          <span className="text-purple-600 flex items-center gap-0.5">
                            <ArrowLeftRight className="h-3.5 w-3.5" />
                            {adj.change > 0 ? `+${adj.change}` : adj.change}
                          </span>
                        ) : isAddition ? (
                          <span className="text-green-600 flex items-center gap-0.5">
                            <ArrowUpRight className="h-3.5 w-3.5" />+
                            {adj.change}
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center gap-0.5">
                            <ArrowDownRight className="h-3.5 w-3.5" />
                            {adj.change}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isTransfer
                            ? "bg-purple-100 text-purple-800"
                            : isAddition
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {adj.reason}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 text-gray-500 max-w-xs truncate"
                      title={adj.notes}
                    >
                      {adj.notes || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
