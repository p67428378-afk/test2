import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Weight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Package,
} from "lucide-react";
import { ordersAPI } from "../services/api";

const SERVICE_TYPES = [
  {
    id: "Wash & Fold",
    name: "Wash & Fold",
    rate: "$3.50/kg",
    desc: "Standard machine wash, tumble dry, and neat fold.",
  },
  {
    id: "Dry Cleaning",
    name: "Dry Cleaning",
    rate: "$8.00/item",
    desc: "Eco-friendly solvent cleaning for delicate garments.",
  },
  {
    id: "Ironing Only",
    name: "Ironing Only",
    rate: "$4.00/item",
    desc: "Professional steam press for wrinkle-free crisp finish.",
  },
];

export default function CustomerBookingCard({ onOrderCreated }) {
  const [serviceType, setServiceType] = useState("Wash & Fold");
  const [weightKg, setWeightKg] = useState(5.0);
  const [itemCount, setItemCount] = useState(10);
  const [pickupDate, setPickupDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [pickupSlot, setPickupSlot] = useState("09:00 - 11:00 AM");
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const in3Days = new Date();
    in3Days.setDate(in3Days.getDate() + 3);
    return in3Days.toISOString().split("T")[0];
  });
  const [deliverySlot, setDeliverySlot] = useState("02:00 - 04:00 PM");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    if (!pickupDate || !deliveryDate) {
      setError("Please select valid pickup and delivery dates.");
      setLoading(false);
      return;
    }

    if (new Date(deliveryDate) < new Date(pickupDate)) {
      setError("Delivery date must be on or after the pickup date.");
      setLoading(false);
      return;
    }

    try {
      const pickupStartISO = new Date(`${pickupDate}T09:00:00Z`).toISOString();
      const pickupEndISO = new Date(`${pickupDate}T11:00:00Z`).toISOString();
      const deliveryStartISO = new Date(
        `${deliveryDate}T14:00:00Z`,
      ).toISOString();
      const deliveryEndISO = new Date(
        `${deliveryDate}T16:00:00Z`,
      ).toISOString();

      const payload = {
        service_type: serviceType,
        pickup_window_start: pickupStartISO,
        pickup_window_end: pickupEndISO,
        delivery_window_start: deliveryStartISO,
        delivery_window_end: deliveryEndISO,
        weight_kg: Number(weightKg),
        item_count: Number(itemCount),
      };

      const createdOrder = await ordersAPI.createOrder(payload);
      setSuccessMsg(
        `Order #${createdOrder.id?.slice(0, 8) || "Created"} successfully scheduled! Status: ${createdOrder.status}`,
      );
      if (onOrderCreated) {
        onOrderCreated(createdOrder);
      }
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        "Failed to schedule pickup. Slot may be unavailable.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-6 text-white">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-blue-200" />
          <h2 className="text-xl font-bold">Schedule Laundry Pickup</h2>
        </div>
        <p className="text-blue-100 text-sm mt-1">
          Select your service, estimated garments, and preferred schedule.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div
            className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-start space-x-3"
            role="alert"
          >
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">{error}</div>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 rounded-r-lg flex items-start space-x-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm font-medium">{successMsg}</div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            1. Choose Service Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SERVICE_TYPES.map((type) => {
              const selected = serviceType === type.id;
              return (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => setServiceType(type.id)}
                  className={`p-4 rounded-xl border text-left transition-all relative ${
                    selected
                      ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={`font-semibold text-sm ${selected ? "text-blue-700" : "text-slate-800"}`}
                    >
                      {type.name}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                      {type.rate}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {type.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center space-x-1">
              <Weight className="h-4 w-4 text-blue-600" />
              <span>Estimated Weight (kg)</span>
            </label>
            <input
              type="number"
              step="0.5"
              min="1"
              max="50"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center space-x-1">
              <Package className="h-4 w-4 text-blue-600" />
              <span>Estimated Item Count</span>
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={itemCount}
              onChange={(e) => setItemCount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span>Pickup Date</span>
            </label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center space-x-1">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>Pickup Window</span>
            </label>
            <select
              value={pickupSlot}
              onChange={(e) => setPickupSlot(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="09:00 - 11:00 AM">09:00 AM - 11:00 AM</option>
              <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
              <option value="02:00 - 04:00 PM">02:00 PM - 04:00 PM</option>
              <option value="04:00 - 06:00 PM">04:00 PM - 06:00 PM</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span>Delivery Date</span>
            </label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center space-x-1">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>Delivery Window</span>
            </label>
            <select
              value={deliverySlot}
              onChange={(e) => setDeliverySlot(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="09:00 - 11:00 AM">09:00 AM - 11:00 AM</option>
              <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
              <option value="02:00 - 04:00 PM">02:00 PM - 04:00 PM</option>
              <option value="04:00 - 06:00 PM">04:00 PM - 06:00 PM</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <span>Scheduling Request...</span>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              <span>Confirm & Schedule Pickup</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
