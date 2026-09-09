import React from "react";
import { Droplet, MapPin, Clock } from "lucide-react";

export default function ScheduleTable({ plants = [], onWaterPlant }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "Not set";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (nextDueDateStr) => {
    if (!nextDueDateStr)
      return (
        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full font-medium">
          No Schedule
        </span>
      );
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(nextDueDateStr);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 border border-red-200 rounded-full font-medium">
          Overdue ({Math.abs(diffDays)}d)
        </span>
      );
    } else if (diffDays === 0) {
      return (
        <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-800 border border-amber-200 rounded-full font-medium">
          Due Today
        </span>
      );
    } else if (diffDays <= 3) {
      return (
        <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 border border-blue-200 rounded-full font-medium">
          In {diffDays} days
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 border border-green-200 rounded-full font-medium">
          In {diffDays} days
        </span>
      );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h3 className="font-bold text-gray-900 text-base">
            Watering Schedule Calendar
          </h3>
          <p className="text-xs text-gray-500">
            Upcoming care tasks and watering cycles
          </p>
        </div>
      </div>

      {plants.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-sm">
          No scheduled plants found. Add plants to your garden to generate a
          schedule.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 bg-gray-50/50 uppercase tracking-wider">
                <th className="py-3 px-6">Plant</th>
                <th className="py-3 px-6">Location</th>
                <th className="py-3 px-6">Interval</th>
                <th className="py-3 px-6">Next Due Date</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {plants.map((plant) => (
                <tr
                  key={plant.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="py-3.5 px-6 font-medium text-gray-900">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-sm font-bold text-[#1C8A5C]">
                        🪴
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 leading-none">
                          {plant.nickname}
                        </p>
                        <p className="text-xs text-gray-500 italic mt-0.5">
                          {plant.species?.common_name ||
                            plant.species_name ||
                            "Houseplant"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-gray-600">
                    <span className="flex items-center gap-1 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {plant.location || "Indoor"}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-gray-600">
                    <span className="flex items-center gap-1 text-xs">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      Every {plant.watering_interval_days || 7} days
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-gray-800 font-medium text-xs">
                    {formatDate(plant.next_due_date)}
                  </td>
                  <td className="py-3.5 px-6">
                    {getStatusBadge(plant.next_due_date)}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => onWaterPlant && onWaterPlant(plant.id)}
                      className="px-3 py-1 bg-emerald-50 text-[#1C8A5C] hover:bg-[#1C8A5C] hover:text-white border border-[#1C8A5C]/20 rounded-md text-xs font-semibold transition-all inline-flex items-center gap-1"
                    >
                      <Droplet className="w-3 h-3 fill-current" />
                      <span>Water</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
