import React, { useState } from "react";
import {
  PackageCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
  Search,
} from "lucide-react";
import { collectDelivery } from "../services/api";

export default function DeliveryTable({ deliveries = [], onRefresh }) {
  const [filterUnit, setFilterUnit] = useState("");
  const [collectingId, setCollectingId] = useState(null);
  const [actionError, setActionError] = useState(null);

  const handleCollect = async (deliveryId) => {
    setCollectingId(deliveryId);
    setActionError(null);
    try {
      await collectDelivery(deliveryId, "Resident acknowledged pickup at gate");
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error("Failed to collect package:", err);
      const detail =
        err.response?.data?.detail || err.message || "Collection failed";
      setActionError(
        typeof detail === "string" ? detail : JSON.stringify(detail),
      );
    } finally {
      setCollectingId(null);
    }
  };

  const filteredDeliveries = deliveries.filter((d) =>
    filterUnit
      ? d.unit_number.toLowerCase().includes(filterUnit.toLowerCase())
      : true,
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-amber-600" />
          <h2 className="text-lg font-bold text-slate-900">
            Package Deliveries Register
          </h2>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter by Unit #..."
            value={filterUnit}
            onChange={(e) => setFilterUnit(e.target.value)}
            className="pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none w-48"
          />
        </div>
      </div>

      {actionError && (
        <div
          role="alert"
          className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg"
        >
          {actionError}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <th className="py-3 px-3">Unit</th>
              <th className="py-3 px-3">Courier</th>
              <th className="py-3 px-3">Tracking / Description</th>
              <th className="py-3 px-3">Logged At</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDeliveries.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400">
                  No delivery packages recorded.
                </td>
              </tr>
            ) : (
              filteredDeliveries.map((item) => (
                <tr
                  key={item.delivery_id || item.id}
                  className="hover:bg-slate-50/80 transition"
                >
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {item.unit_number}
                  </td>
                  <td className="py-3 px-3 text-slate-800 font-medium">
                    {item.courier_name}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    <div className="font-mono text-[11px] text-slate-800">
                      {item.tracking_number || "N/A"}
                    </div>
                    <div className="text-slate-500 text-[10px]">
                      {item.package_description}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {item.logged_at
                      ? new Date(item.logged_at).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-col items-start gap-1">
                      {item.status === "PENDING_PICKUP" ? (
                        <span className="bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                          Pending Pickup
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />{" "}
                          Collected
                        </span>
                      )}

                      {item.is_overdue && item.status === "PENDING_PICKUP" && (
                        <span className="bg-red-100 text-red-800 font-bold text-[10px] px-2 py-0.5 rounded-full border border-red-300 flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3 text-red-600" />{" "}
                          OVERDUE (&gt;48h)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {item.status === "PENDING_PICKUP" ? (
                      <button
                        onClick={() =>
                          handleCollect(item.delivery_id || item.id)
                        }
                        disabled={
                          collectingId === (item.delivery_id || item.id)
                        }
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition shadow-sm disabled:opacity-50"
                      >
                        {collectingId === (item.delivery_id || item.id)
                          ? "Marking..."
                          : "Mark Collected"}
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">
                        Picked up{" "}
                        {item.collected_at
                          ? new Date(item.collected_at).toLocaleTimeString()
                          : ""}
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
  );
}
