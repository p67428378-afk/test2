import React from "react";
import { AlertTriangle } from "lucide-react";

export default function LowStockAlerts({ alerts = [] }) {
  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl shadow-sm w-full overflow-hidden">
      <div className="px-6 py-4 border-b border-[#e3e8f0] flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <h3 className="font-bold text-lg text-[#0f172a]">Low Stock Alerts</h3>
      </div>

      <div className="overflow-x-auto">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-[#707a8c]">
            All items are sufficiently stocked. No alerts at this time.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-[#707a8c] uppercase border-b border-[#e3e8f0]">
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Item Name</th>
                <th className="px-6 py-3">Warehouse</th>
                <th className="px-6 py-3 text-right">Current Stock</th>
                <th className="px-6 py-3 text-right">Threshold</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e8f0] text-sm">
              {alerts.map((alert, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono font-medium text-gray-900">
                    {alert.sku}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{alert.name}</td>
                  <td className="px-6 py-4 text-gray-600">{alert.warehouse}</td>
                  <td className="px-6 py-4 text-right font-semibold text-red-600">
                    {alert.current_stock}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-500">
                    {alert.threshold}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {alert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
