import React from "react";
import {
  Package,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export default function AvailableFoodList({
  donations,
  selectedDonation,
  onSelectDonation,
}) {
  const availableDonations = (donations || []).filter(
    (d) => d.freshness_status === "FRESH" || d.freshness_status === "WARNING",
  );

  if (availableDonations.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500">
        <Package className="h-10 w-10 mx-auto mb-2 text-slate-400" />
        <p className="font-medium text-slate-700">
          No surplus food available right now
        </p>
        <p className="text-sm">
          Check back shortly when restaurant donors post new surplus food.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
        <Package className="h-5 w-5 text-emerald-600" />
        <span>Available Food Listings for Claims</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableDonations.map((item) => {
          const isSelected = selectedDonation?.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelectDonation(item)}
              className={`border rounded-xl p-4 cursor-pointer transition flex flex-col justify-between ${
                isSelected
                  ? "border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/30"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-slate-800">{item.category}</h3>
                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      item.freshness_status === "FRESH"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.freshness_status === "FRESH" ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                    <span>{item.freshness_status}</span>
                  </span>
                </div>

                <div className="space-y-1.5 my-3 text-sm text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-slate-400" />
                    <span className="font-semibold text-slate-700">
                      {item.quantity} kg
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span>Shelf Life: {item.estimated_shelf_life} hrs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="truncate">{item.pickup_address}</span>
                  </div>
                </div>
              </div>

              <button
                className={`w-full mt-2 py-2 px-3 rounded-lg font-medium text-xs flex items-center justify-center space-x-1.5 transition ${
                  isSelected
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>
                  {isSelected ? "Selected for Claim" : "Request Claim"}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
