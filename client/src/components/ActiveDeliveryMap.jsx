import React from "react";
import { MapPin, Navigation } from "lucide-react";

export default function ActiveDeliveryMap({ pickupAddress, deliveryAddress }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Navigation className="w-5 h-5 text-emerald-600" />
        Delivery Route Map
      </h3>

      <div className="relative h-64 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
        {/* Mock Map Background */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Mock Route Line */}
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 100 180 Q 200 80 300 120 T 500 80"
            fill="none"
            stroke="#10b981"
            strokeWidth="4"
            strokeDasharray="8 4"
            className="animate-[dash_2s_linear_infinite]"
          />
        </svg>

        {/* Pickup Pin */}
        <div className="absolute left-[80px] bottom-[60px] flex flex-col items-center">
          <div className="bg-amber-500 text-white p-1.5 rounded-full shadow-md">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="bg-white px-2 py-0.5 rounded shadow text-xs font-bold mt-1 border border-slate-200">
            Pickup
          </span>
        </div>

        {/* Delivery Pin */}
        <div className="absolute right-[120px] top-[60px] flex flex-col items-center">
          <div className="bg-emerald-600 text-white p-1.5 rounded-full shadow-md">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="bg-white px-2 py-0.5 rounded shadow text-xs font-bold mt-1 border border-slate-200">
            Delivery
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-slate-200 text-xs space-y-1">
          <p className="font-semibold text-slate-800">Route Details:</p>
          <p className="text-slate-600">
            <span className="font-medium">From:</span>{" "}
            {pickupAddress || "Restaurant Location"}
          </p>
          <p className="text-slate-600">
            <span className="font-medium">To:</span>{" "}
            {deliveryAddress || "NGO Location"}
          </p>
        </div>
      </div>
    </div>
  );
}
