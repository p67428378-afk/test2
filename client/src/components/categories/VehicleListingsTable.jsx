import React from "react";
import { Car, Bike, CheckCircle2, Clock, MapPin } from "lucide-react";

export default function VehicleListingsTable({
  listings = [],
  selectedCategory = "",
  loading = false,
}) {
  const filteredListings = selectedCategory
    ? listings.filter(
        (item) =>
          item.category?.toLowerCase() === selectedCategory.toLowerCase(),
      )
    : listings;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Vehicle Inventory & Listings
          </h2>
          <p className="text-xs text-slate-500">
            {selectedCategory
              ? `Showing vehicles filtered by '${selectedCategory}'`
              : "Showing all available fleet vehicles across categories"}
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
          {filteredListings.length}{" "}
          {filteredListings.length === 1 ? "vehicle" : "vehicles"}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3 p-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 bg-slate-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 p-6">
          <Car className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">
            No Vehicles Found
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            No vehicle listings match the currently selected category '
            {selectedCategory}'. Try selecting 'All Categories'.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-700">
            <thead className="text-xs uppercase bg-slate-100 text-slate-600 font-semibold">
              <tr>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Category</th>
                <th className="p-3">Daily Rate</th>
                <th className="p-3">Status</th>
                <th className="p-3">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredListings.map((v) => {
                const isCar = v.category?.toLowerCase() === "car";
                const isBike = v.category?.toLowerCase() === "bike";

                return (
                  <tr
                    key={v.id || v.name}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-3 font-medium text-slate-900 flex items-center gap-2">
                      {isCar ? (
                        <Car className="w-4 h-4 text-blue-600" />
                      ) : isBike ? (
                        <Bike className="w-4 h-4 text-purple-600" />
                      ) : (
                        <Car className="w-4 h-4 text-slate-500" />
                      )}
                      <span>{v.name}</span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1 ${
                          isCar
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : isBike
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : "bg-slate-100 text-slate-800 border border-slate-200"
                        }`}
                      >
                        {v.category}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-900">
                      ${v.dailyRate?.toFixed(2) || v.rate || "45.00"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1 ${
                          v.status?.toLowerCase() === "available"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {v.status?.toLowerCase() === "available" ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Clock className="w-3 h-3 text-amber-600" />
                        )}
                        {v.status || "Available"}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{v.location || "Downtown Station"}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
