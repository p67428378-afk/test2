import React from "react";
import {
  Bed,
  DollarSign,
  Wrench,
  Sparkles,
  CheckCircle,
  UserCheck,
} from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

export default function RoomCard({ room, onStatusChange, isUpdating }) {
  const statusOptions = ["Available", "Occupied", "Cleaning", "Maintenance"];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Available":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "Occupied":
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case "Cleaning":
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case "Maintenance":
        return <Wrench className="w-4 h-4 text-rose-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-slate-200 overflow-hidden flex flex-col justify-between">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#0b1c30]">
                Room {room.room_number}
              </span>
              {getStatusIcon(room.status)}
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              {room.room_type}
            </span>
          </div>
          <StatusBadge status={room.status} type="room" />
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-baseline justify-between">
          <span className="text-xs text-slate-500">Nightly Rate</span>
          <div className="flex items-center text-lg font-bold text-slate-900">
            <DollarSign className="w-4 h-4 text-slate-400 -mr-0.5" />
            {Number(room.daily_rate).toFixed(2)}
            <span className="text-xs text-slate-400 font-normal ml-1">
              / night
            </span>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <label
          htmlFor={`room-status-${room.id}`}
          className="text-xs font-medium text-slate-600"
        >
          Status:
        </label>
        <select
          id={`room-status-${room.id}`}
          value={room.status}
          disabled={isUpdating}
          onChange={(e) =>
            onStatusChange && onStatusChange(room.id, e.target.value)
          }
          className="text-xs font-medium bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-slate-700 hover:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
