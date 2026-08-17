import React from "react";
import {
  Truck,
  MapPin,
  CheckCircle,
  Navigation,
  Clock,
  AlertCircle,
} from "lucide-react";
import { deliveryApi } from "../../services/api";

export default function ActiveDeliveryCard({ deliveries, onDeliveryUpdated }) {
  const handleStatusChange = async (deliveryId, newStatus) => {
    try {
      await deliveryApi.updateDeliveryStatus(deliveryId, { status: newStatus });
      if (onDeliveryUpdated) onDeliveryUpdated();
    } catch (err) {
      console.error("Failed to update delivery status:", err);
    }
  };

  if (!deliveries || deliveries.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500">
        <Truck className="h-10 w-10 mx-auto mb-2 text-slate-400" />
        <p className="font-medium text-slate-700">
          No active delivery tasks assigned
        </p>
        <p className="text-sm">
          Available tasks will appear here when NGOs place claim requests.
        </p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "TASK_ACCEPTED":
        return "bg-blue-100 text-blue-800";
      case "ARRIVED_AT_PICKUP":
        return "bg-indigo-100 text-indigo-800";
      case "IN_TRANSIT":
        return "bg-amber-100 text-amber-800";
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-800";
      case "CANCELLED":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
        <Truck className="h-5 w-5 text-emerald-600" />
        <span>Active Delivery Dispatch Tasks</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between bg-slate-50/50 hover:border-slate-300 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-slate-500">
                  Task #{delivery.id.slice(0, 8)}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(delivery.status)}`}
                >
                  {delivery.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-slate-600 mb-4">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">
                      PICKUP LOCATION
                    </span>
                    <span>Donor Restaurant Location</span>
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <Navigation className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">
                      DELIVERY DESTINATION
                    </span>
                    <span>NGO Shelter Center</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <span className="text-xs text-slate-500 block mb-2 font-medium">
                Update Delivery Progress:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {delivery.status !== "TASK_ACCEPTED" && (
                  <button
                    onClick={() =>
                      handleStatusChange(delivery.id, "TASK_ACCEPTED")
                    }
                    className="py-1.5 px-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded font-medium transition"
                  >
                    Accept Task
                  </button>
                )}
                {delivery.status !== "ARRIVED_AT_PICKUP" && (
                  <button
                    onClick={() =>
                      handleStatusChange(delivery.id, "ARRIVED_AT_PICKUP")
                    }
                    className="py-1.5 px-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded font-medium transition"
                  >
                    Arrived at Pickup
                  </button>
                )}
                {delivery.status !== "IN_TRANSIT" && (
                  <button
                    onClick={() =>
                      handleStatusChange(delivery.id, "IN_TRANSIT")
                    }
                    className="py-1.5 px-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded font-medium transition"
                  >
                    In Transit
                  </button>
                )}
                {delivery.status !== "DELIVERED" && (
                  <button
                    onClick={() => handleStatusChange(delivery.id, "DELIVERED")}
                    className="py-1.5 px-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded font-medium transition"
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
