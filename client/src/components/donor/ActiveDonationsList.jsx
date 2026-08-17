import React from "react";
import {
  Clock,
  MapPin,
  Package,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { donationApi } from "../../services/api";

export default function ActiveDonationsList({ donations, onRefresh }) {
  const handleFreshnessUpdate = async (id, newStatus) => {
    try {
      await donationApi.updateFreshness(id, newStatus);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to update freshness:", err);
    }
  };

  const getFreshnessBadge = (status) => {
    switch (status) {
      case "FRESH":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>FRESH</span>
          </span>
        );
      case "WARNING":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            <span>WARNING</span>
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            <XCircle className="h-3.5 w-3.5 text-rose-600" />
            <span>EXPIRED</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
            {status}
          </span>
        );
    }
  };

  if (!donations || donations.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500">
        <Package className="h-10 w-10 mx-auto mb-2 text-slate-400" />
        <p className="font-medium text-slate-700">No active donations yet</p>
        <p className="text-sm">Use the form above to post surplus food.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
          <Package className="h-5 w-5 text-emerald-600" />
          <span>Active Food Donations</span>
        </h2>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            title="Refresh list"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {donations.map((item) => (
          <div
            key={item.id}
            className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition flex flex-col justify-between bg-slate-50/50"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-slate-800">{item.category}</h3>
                  <p className="text-xs text-slate-500">
                    Storage: {item.storage_condition}
                  </p>
                </div>
                {getFreshnessBadge(item.freshness_status)}
              </div>

              <div className="space-y-1.5 my-3 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Quantity: {item.quantity} kg / units</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Shelf Life: {item.estimated_shelf_life} hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="truncate">{item.pickup_address}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Prep:{" "}
                {new Date(item.preparation_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>

              {item.freshness_status !== "EXPIRED" && (
                <div className="flex items-center space-x-1">
                  <span className="text-slate-500 mr-1">Mark:</span>
                  <button
                    onClick={() => handleFreshnessUpdate(item.id, "WARNING")}
                    className="px-2 py-1 bg-amber-100 text-amber-800 hover:bg-amber-200 rounded font-medium transition"
                  >
                    Warning
                  </button>
                  <button
                    onClick={() => handleFreshnessUpdate(item.id, "EXPIRED")}
                    className="px-2 py-1 bg-rose-100 text-rose-800 hover:bg-rose-200 rounded font-medium transition"
                  >
                    Expired
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
