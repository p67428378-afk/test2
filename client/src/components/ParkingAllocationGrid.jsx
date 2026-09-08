import React from "react";
import { Car, ParkingCircle, AlertCircle } from "lucide-react";

export default function ParkingAllocationGrid({ activeOverstays = [] }) {
  // Generate 50 slots P-01 to P-50
  const slots = Array.from({ length: 50 }, (_, i) => {
    const slotId = `P-${String(i + 1).padStart(2, "0")}`;
    // Check if slot has an active overstay
    const match = activeOverstays.find(
      (o) => o.slot_number === slotId || o.assigned_parking_slot === slotId,
    );
    return {
      id: slotId,
      occupied: i < 8 || !!match, // simulate some occupied slots
      vehicle: match ? match.vehicle_number : i < 8 ? `VEH-${100 + i}` : null,
      isOverstay: !!match,
      visitorName: match ? match.visitor_name : null,
    };
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <ParkingCircle className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">
            50-Slot Vehicle Parking Allocation Grid
          </h2>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span>{" "}
            Available
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-blue-600 rounded-sm"></span> Occupied
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-red-600 rounded-sm animate-pulse"></span>{" "}
            Overstay
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className={`p-2 rounded-lg border text-center transition flex flex-col items-center justify-between h-16 ${
              slot.isOverstay
                ? "bg-red-600 text-white border-red-700 shadow-md animate-pulse"
                : slot.occupied
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <span className="font-extrabold text-[11px] font-mono tracking-tighter">
              {slot.id}
            </span>
            <Car
              className={`w-4 h-4 ${slot.occupied || slot.isOverstay ? "text-white" : "text-slate-400"}`}
            />
            <span className="text-[9px] font-mono truncate max-w-full">
              {slot.isOverstay
                ? "OVERSTAY"
                : slot.vehicle
                  ? slot.vehicle
                  : "Empty"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
